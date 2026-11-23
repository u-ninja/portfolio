'use client';
import { useEffect, useRef } from 'react';
import { reducedMotion } from '../lib/scroll';

const TAU = Math.PI * 2;
const HUBS = 140; // the first points of every shape are wired together as a visible graph

// Every shape is the same n points in a different arrangement, so morphing is just a change of target.
function buildShapes(n: number) {
  let seed = 7;
  const r = () => (seed = (seed * 16807) % 2147483647) / 2147483647; // seeded: same object on every visit
  const mk = (f: (i: number) => number[]) => {
    const a = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) a.set(f(i), i * 3);
    return a;
  };
  const side = Math.ceil(Math.cbrt(n));
  return {
    scatter: mk(() => [(r() - 0.5) * 9, (r() - 0.5) * 9, (r() - 0.5) * 5]),
    knot: mk((i) => {
      const u = (i < HUBS ? i / HUBS : r()) * TAU;
      const tube = i < HUBS ? 0 : 0.17 * Math.cbrt(r());
      const a = r() * TAU;
      const b = Math.acos(2 * r() - 1);
      const R = 2 + Math.cos(3 * u);
      return [
        (R * Math.cos(2 * u)) / 3 + tube * Math.sin(b) * Math.cos(a),
        (R * Math.sin(2 * u)) / 3 + tube * Math.sin(b) * Math.sin(a),
        Math.sin(3 * u) * 0.45 + tube * Math.cos(b),
      ];
    }),
    lattice: mk((i) => [
      ((i % side) / (side - 1)) * 1.7 - 0.85,
      ((Math.floor(i / side) % side) / (side - 1)) * 1.7 - 0.85,
      (Math.floor(i / side / side) / (side - 1)) * 1.7 - 0.85,
    ]),
    layers: mk((i) => [(r() - 0.5) * 2.4, (i % 5) * 0.4 - 0.8, (r() - 0.5) * 1.5]),
    wave: mk(() => {
      const x = (r() - 0.5) * 3.8;
      const z = (r() - 0.5) * 2.6;
      return [x, 0.16 * Math.sin(3 * x) + 0.16 * Math.cos(4 * z) + 0.5, z];
    }),
    dust: mk(() => [(r() - 0.5) * 5.5, (r() - 0.5) * 4, (r() - 0.5) * 4]),
  };
}

/** Fixed full-page canvas. Sections steer it with data-shape / data-alpha / data-x / data-scale. */
export function ParticleField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    const ctx = cv?.getContext('2d');
    if (!cv || !ctx) return;

    // Shaded sphere sprites, drawn once; stamping an image is far cheaper than thousands of arcs per frame.
    const sphere = (base: string, light: string) => {
      const c = document.createElement('canvas');
      c.width = c.height = 32;
      const g = c.getContext('2d')!;
      const grad = g.createRadialGradient(11, 10, 1, 16, 16, 16);
      grad.addColorStop(0, light);
      grad.addColorStop(0.45, base);
      grad.addColorStop(1, 'rgba(0,0,0,0.55)');
      g.fillStyle = grad;
      g.beginPath();
      g.arc(16, 16, 15.5, 0, Math.PI * 2);
      g.fill();
      return c;
    };
    const blue = sphere('#4d7dff', '#cfdcff');
    const pale = sphere('#dfe6f5', '#ffffff');

    const small = window.innerWidth < 768;
    const n = small ? 1100 : 2600;
    const shapes = buildShapes(n);
    const still = reducedMotion();
    const pos = Float32Array.from(still ? shapes.knot : shapes.scatter);
    const vel = new Float32Array(n * 3);
    const hub = new Float32Array(HUBS * 2);
    const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-shape]'));
    const t0 = performance.now();
    let w = 0, h = 0, dpr = 1, raf = 0;
    let ry = 0, rx = 0.3, cx = 0.5, alpha = 0, scale = 1;
    let mx = 0, my = 0, px = -999, py = -999;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, small ? 1.5 : 2);
      w = window.innerWidth;
      h = window.innerHeight;
      cv.width = w * dpr;
      cv.height = h * dpr;
    };
    const move = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
      mx = e.clientX / w - 0.5;
      my = e.clientY / h - 0.5;
    };

    const frame = () => {
      let d: DOMStringMap = sections[0]?.dataset ?? {};
      for (const el of sections) {
        const b = el.getBoundingClientRect();
        if (b.top <= h / 2 && b.bottom > h / 2) {
          d = el.dataset;
          break;
        }
      }
      const target = shapes[d.shape as keyof typeof shapes] ?? shapes.dust;
      const ease = still ? 1 : 0.06;
      cx += ((small ? 0.5 : 0.5 + Number(d.x ?? 0) * 0.5) - cx) * ease;
      alpha += (Number(d.alpha ?? 0.3) * (small ? 0.6 : 1) - alpha) * ease;
      scale += (Number(d.scale ?? 1) - scale) * ease;
      const drift = still ? 0 : ((performance.now() - t0) / 1000) * 0.06 + mx * 0.7;
      ry += (drift + window.scrollY * 0.0009 - ry) * ease;
      rx += (0.3 + (still ? 0 : my * 0.45) - rx) * ease;

      const cosY = Math.cos(ry), sinY = Math.sin(ry), cosX = Math.cos(rx), sinX = Math.sin(rx);
      const S = Math.min(w, h) * 0.38 * scale * dpr;
      const ox = cx * w * dpr;
      const oy = (small ? 0.4 : 0.5) * h * dpr;

      ctx.clearRect(0, 0, cv.width, cv.height);
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < n; i++) {
        const k = i * 3;
        if (still) {
          pos[k] = target[k]; pos[k + 1] = target[k + 1]; pos[k + 2] = target[k + 2];
        } else {
          // damped spring per point; uneven stiffness makes the object arrive in waves, not all at once
          const stiff = 0.012 + (i % 7) * 0.003;
          for (let j = k; j < k + 3; j++) {
            vel[j] = vel[j] * 0.88 + (target[j] - pos[j]) * stiff;
            pos[j] += vel[j];
          }
        }
        const x1 = pos[k] * cosY + pos[k + 2] * sinY;
        const z1 = pos[k + 2] * cosY - pos[k] * sinY;
        const y2 = pos[k + 1] * cosX - z1 * sinX;
        const z2 = z1 * cosX + pos[k + 1] * sinX;
        if (z2 < -2.8) continue;
        const persp = Math.min(1.7, 3.2 / (3.2 + z2)); // capped so near points don't turn into blocks
        let sx = ox + x1 * S * persp;
        let sy = oy + y2 * S * persp;
        const dx = sx / dpr - px, dy = sy / dpr - py, dd = dx * dx + dy * dy;
        if (dd < 14400 && dd > 1) {
          // the pointer parts the cloud
          const f = ((120 - Math.sqrt(dd)) * 0.35 * dpr) / Math.sqrt(dd);
          sx += dx * f;
          sy += dy * f;
        }
        if (i < HUBS) {
          hub[i * 2] = sx;
          hub[i * 2 + 1] = sy;
        }
        const size = (i % 5 === 0 ? 2.6 : 1.6) * persp * dpr;
        ctx.globalAlpha = alpha * Math.min(1, Math.max(0.12, 0.25 + (1.2 - z2) * 0.45));
        const d = size * 1.5;
        ctx.drawImage(i % 4 === 0 ? blue : pale, sx - d / 2, sy - d / 2, d, d);
      }

      ctx.globalAlpha = alpha * 0.35;
      ctx.strokeStyle = '#4d7dff';
      ctx.lineWidth = dpr;
      ctx.beginPath();
      const maxLen = (S * 0.3) ** 2;
      for (let i = 0; i < HUBS; i++) {
        const j = ((i + 1) % HUBS) * 2;
        const dx = hub[i * 2] - hub[j], dy = hub[i * 2 + 1] - hub[j + 1];
        if (dx * dx + dy * dy < maxLen) {
          ctx.moveTo(hub[i * 2], hub[i * 2 + 1]);
          ctx.lineTo(hub[j], hub[j + 1]);
        }
      }
      ctx.stroke();
      if (!still) raf = requestAnimationFrame(frame);
    };

    const onResize = () => {
      resize();
      if (still) frame();
    };
    resize();
    window.addEventListener('resize', onResize);
    if (still) {
      // reduced motion: no loop, the object just snaps to each scene's shape
      window.addEventListener('scroll', frame, { passive: true });
      frame();
    } else {
      window.addEventListener('pointermove', move, { passive: true });
      raf = requestAnimationFrame(frame);
    }
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', frame);
      window.removeEventListener('pointermove', move);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 h-full w-full" />;
}
