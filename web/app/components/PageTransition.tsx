'use client';
import { useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { reducedMotion } from '../lib/scroll';

// Page change: a burn creeps out from the click as single device pixels, the route swaps underneath, then the burn eats the cover away.
// The canvas holds one pixel per cell and is scaled up unsmoothed, so a QHD screen costs about one ImageData upload per frame.
// Arrival time = distance from the click bent by fractal noise, so the front fingers outward like a spreading infection.
const CELL = 3; // device pixels per cell
const IN = 950, OUT = 1150, MIN_HOLD = 120, GIVE_UP = 4000;
const EDGE = 0.04; // width of the glowing front, in arrival-time units
const INK = 0xff0a0605, HOT = 0xffffe0cf, MID = 0xffffa886, LOW = 0xffff6b2f; // ABGR
const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);
const clamp = (v: number) => Math.min(1, Math.max(0, v));

type Phase = 'idle' | 'in' | 'hold' | 'out';

/** Value noise in [0,1): three octaves of a random lattice, bilinear with smoothstep. */
function noiseField(cols: number, rows: number) {
  const octs = [[48, 0.55], [18, 0.3], [7, 0.15]].map(([cell, w]) => {
    const gx = Math.ceil(cols / cell) + 2, gy = Math.ceil(rows / cell) + 2;
    return { cell, w, gx, g: Float32Array.from({ length: gx * gy }, Math.random) };
  });
  return (x: number, y: number) => {
    let v = 0;
    for (const { cell, w, gx, g } of octs) {
      const fx = x / cell, fy = y / cell, ix = fx | 0, iy = fy | 0;
      const tx = fx - ix, ty = fy - iy, sx = tx * tx * (3 - 2 * tx), sy = ty * ty * (3 - 2 * ty);
      const i = iy * gx + ix;
      v += w * ((g[i] * (1 - sx) + g[i + 1] * sx) * (1 - sy) + (g[i + gx] * (1 - sx) + g[i + gx + 1] * sx) * sy);
    }
    return v;
  };
}

export function PageTransition() {
  const cv = useRef<HTMLCanvasElement>(null);
  const router = useRouter();
  const path = usePathname();
  const pathNow = useRef(path);
  useEffect(() => { pathNow.current = path; }, [path]);

  useEffect(() => {
    const canvas = cv.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || reducedMotion()) return;

    let phase: Phase = 'idle';
    let t0 = 0, raf = 0, startPath = '', target = '', frameNo = 0;
    let arrive = new Float32Array(0), cols = 0, rows = 0;
    let img = ctx.createImageData(1, 1), px = new Uint32Array(img.data.buffer);

    // p: how far the burn has travelled (0 to just past 1). 'in' fills what it has reached; 'out' clears it.
    const draw = (p: number) => {
      const out = phase === 'out';
      frameNo++;
      for (let i = 0; i < arrive.length; i++) {
        const r = arrive[i];
        const d = out ? r - p : p - r; // distance behind the front; the front is where d = 0
        if (d >= EDGE) px[i] = INK;
        else if (d >= 0) { const k = d / EDGE; px[i] = k < 0.34 ? HOT : k < 0.67 ? MID : LOW; }
        else if (!out && d > -EDGE * 1.4 && (Math.imul(i ^ Math.imul(frameNo, 0x9e3779b1), 0x85ebca6b) >>> 16) % 11 === 0) px[i] = HOT; // sparks ahead of the front
        else px[i] = 0;
      }
      ctx.putImageData(img, 0, 0);
    };

    const finish = () => {
      phase = 'idle';
      canvas.style.display = 'none';
      document.documentElement.style.overflow = '';
    };

    const frame = (now: number) => {
      const dt = now - t0;
      if (phase === 'in') {
        draw(ease(clamp(dt / IN)) * 1.12);
        if (dt >= IN) { phase = 'hold'; t0 = now; router.push(target); }
      } else if (phase === 'hold') {
        draw(1.12);
        if ((pathNow.current !== startPath && dt > MIN_HOLD) || dt > GIVE_UP) { phase = 'out'; t0 = now; }
      } else if (phase === 'out') {
        draw(ease(clamp(dt / OUT)) * 1.12);
        if (dt >= OUT) return finish();
      }
      raf = requestAnimationFrame(frame);
    };

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element).closest?.('a[href]') as HTMLAnchorElement | null;
      if (!a || a.target === '_blank' || a.hasAttribute('download')) return;
      const url = new URL(a.href, location.href);
      const file = url.pathname.split('/').pop()!.includes('.');
      if (url.origin !== location.origin || url.pathname === location.pathname || file) return;
      const box = a.getBoundingClientRect();
      const ox = e.detail === 0 ? box.left + box.width / 2 : e.clientX; // keyboard activation has no pointer position
      const oy = e.detail === 0 ? box.top + box.height / 2 : e.clientY;
      e.preventDefault();
      e.stopPropagation(); // keep Next's own Link handler from navigating before the cover is up
      if (phase !== 'idle') return;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const k = dpr / CELL; // cells per CSS pixel
      cols = Math.ceil(innerWidth * k); rows = Math.ceil(innerHeight * k);
      canvas.width = cols; canvas.height = rows;
      img = ctx.createImageData(cols, rows); px = new Uint32Array(img.data.buffer);
      const reach = Math.max(Math.hypot(ox, oy), Math.hypot(innerWidth - ox, oy), Math.hypot(ox, innerHeight - oy), Math.hypot(innerWidth - ox, innerHeight - oy)) * k;
      const noise = noiseField(cols, rows), cx = ox * k, cy = oy * k;
      arrive = new Float32Array(cols * rows);
      for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
        arrive[y * cols + x] = (Math.hypot(x - cx, y - cy) / reach) * 0.6 + noise(x, y) * 0.4 + Math.random() * 0.02;
      }
      startPath = location.pathname;
      target = url.pathname + url.search + url.hash;
      canvas.style.display = 'block';
      document.documentElement.style.overflow = 'hidden';
      phase = 'in';
      t0 = performance.now();
      raf = requestAnimationFrame(frame);
    };

    document.addEventListener('click', onClick, true);
    return () => {
      document.removeEventListener('click', onClick, true);
      cancelAnimationFrame(raf);
      finish();
    };
  }, [router]);

  return <canvas ref={cv} aria-hidden="true" style={{ display: 'none', imageRendering: 'pixelated' }} className="pointer-events-none fixed inset-0 z-[90] h-full w-full" />;
}
