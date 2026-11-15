'use client';
import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../lib/scroll';
import { SceneHead } from './SceneHead';

const stack = [
  'React', 'Next.js', 'TypeScript', 'Node.js', 'Vue.js', 'Nuxt.js', 'TanStack', 'Tailwind', 'Express', 'Bun',
  'Socket.IO', 'Zod', 'PostgreSQL', 'Azure SQL', 'MongoDB', 'Prisma', 'Azure', 'Vercel', 'RBAC', 'SAP S/4HANA',
  'Claude API', 'Rust', 'Tauri', 'Python',
];

type Body = { x: number; y: number; vx: number; vy: number; r: number; label: string };

export function Playground() {
  const still = useReducedMotion();
  const ref = useRef<HTMLCanvasElement>(null);
  const gravity = useRef(1);
  const kick = useRef(false);

  useEffect(() => {
    const cv = ref.current;
    const ctx = cv?.getContext('2d');
    if (!cv || !ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0, h = 0, raf = 0, visible = false, held = -1;
    let px = -999, py = -999;
    const bodies: Body[] = [];

    const resize = () => {
      w = cv.clientWidth;
      h = cv.clientHeight;
      cv.width = w * dpr;
      cv.height = h * dpr;
    };
    resize();
    const scale = w < 640 ? 0.72 : 1;
    stack.forEach((label, i) => {
      const r = (20 + label.length * 3.4) * scale;
      bodies.push({ x: r + ((i * 137) % Math.max(1, w - 2 * r)), y: -r - i * 40, vx: 0, vy: 0, r, label });
    });

    const step = () => {
      if (kick.current) {
        kick.current = false;
        for (const b of bodies) {
          b.vx += (Math.random() - 0.5) * 30;
          b.vy -= 10 + Math.random() * 14;
        }
      }
      bodies.forEach((b, i) => {
        if (i === held) {
          // a held body is on a spring to the pointer, so letting go throws it
          b.vx = (px - b.x) * 0.3;
          b.vy = (py - b.y) * 0.3;
        } else {
          b.vy += 0.45 * gravity.current;
          const dx = b.x - px, dy = b.y - py, d = Math.hypot(dx, dy);
          if (held < 0 && d < b.r + 60 && d > 0) {
            b.vx += (dx / d) * 0.9;
            b.vy += (dy / d) * 0.9;
          }
        }
        b.vx *= 0.992;
        b.vy *= 0.992;
        b.x += b.vx;
        b.y += b.vy;
        if (b.x < b.r) { b.x = b.r; b.vx *= -0.55; }
        if (b.x > w - b.r) { b.x = w - b.r; b.vx *= -0.55; }
        if (b.y > h - b.r) { b.y = h - b.r; b.vy *= -0.55; }
        if (b.y < b.r && gravity.current < 0) { b.y = b.r; b.vy *= -0.55; }
      });
      // circle-circle collisions: push apart, then exchange momentum along the contact normal (mass ~ r²)
      for (let pass = 0; pass < 3; pass++) {
        for (let i = 0; i < bodies.length; i++) {
          for (let j = i + 1; j < bodies.length; j++) {
            const a = bodies[i], b = bodies[j];
            const dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy) || 0.01, min = a.r + b.r;
            if (d >= min) continue;
            const nx = dx / d, ny = dy / d, ma = a.r * a.r, mb = b.r * b.r, over = min - d;
            a.x -= nx * over * (mb / (ma + mb));
            a.y -= ny * over * (mb / (ma + mb));
            b.x += nx * over * (ma / (ma + mb));
            b.y += ny * over * (ma / (ma + mb));
            const rel = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
            if (rel > 0) continue;
            const imp = (-1.5 * rel) / (1 / ma + 1 / mb);
            a.vx -= (imp / ma) * nx;
            a.vy -= (imp / ma) * ny;
            b.vx += (imp / mb) * nx;
            b.vy += (imp / mb) * ny;
          }
        }
      }
    };

    const draw = () => {
      step();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.font = `${Math.round(12 * scale)}px ${getComputedStyle(cv).fontFamily}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      bodies.forEach((b, i) => {
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r - 1, 0, Math.PI * 2);
        ctx.fillStyle = i === held ? '#2f6bff' : '#0b0d14';
        ctx.fill();
        ctx.strokeStyle = i === held ? '#2f6bff' : i % 4 === 0 ? '#86a8ff' : 'rgba(255,255,255,0.22)';
        ctx.stroke();
        ctx.fillStyle = '#f3f5f9';
        ctx.fillText(b.label, b.x, b.y);
      });
      if (visible) raf = requestAnimationFrame(draw);
    };

    const local = (e: PointerEvent) => {
      const r = cv.getBoundingClientRect();
      px = e.clientX - r.left;
      py = e.clientY - r.top;
    };
    const down = (e: PointerEvent) => {
      local(e);
      held = bodies.findIndex((b) => Math.hypot(b.x - px, b.y - py) < b.r);
      if (held >= 0) cv.setPointerCapture(e.pointerId);
    };
    const up = () => { held = -1; };
    const leave = () => { if (held < 0) { px = -999; py = -999; } };
    cv.addEventListener('pointermove', local);
    cv.addEventListener('pointerdown', down);
    cv.addEventListener('pointerup', up);
    cv.addEventListener('pointercancel', up);
    cv.addEventListener('pointerleave', leave);
    window.addEventListener('resize', resize);

    // the simulation sleeps whenever the canvas is off screen
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible) raf = requestAnimationFrame(draw);
    });
    io.observe(cv);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [still]);

  return (
    <section id="play" data-shape="dust" data-alpha="0.15" className="relative px-6 py-24 md:px-10 md:py-36">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <SceneHead fn="if (curious) play()" title="Throw my stack around">
            Everything I work with, as rigid bodies. Drag one, throw it, or push through the pile with your pointer.
          </SceneHead>
          {!still && (
            <div className="flex shrink-0 gap-3">
              <button type="button" className="btn cursor-pointer" onClick={() => { gravity.current *= -1; }}>Flip gravity</button>
              <button type="button" className="btn cursor-pointer" onClick={() => { kick.current = true; }}>Shake</button>
            </div>
          )}
        </div>

        {still ? (
          <ul className="mt-12 flex flex-wrap gap-2 font-mono text-sm">
            {stack.map((s) => <li key={s} className="border border-line px-3 py-2">{s}</li>)}
          </ul>
        ) : (
          <>
            <canvas
              ref={ref}
              aria-hidden="true"
              className="mt-12 block h-[62svh] min-h-[380px] w-full touch-pan-y border border-line bg-ink/60 font-mono"
            />
            <ul className="sr-only">{stack.map((s) => <li key={s}>{s}</li>)}</ul>
          </>
        )}
      </div>
    </section>
  );
}
