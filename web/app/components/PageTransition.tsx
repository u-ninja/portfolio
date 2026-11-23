'use client';
import { useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { reducedMotion } from '../lib/scroll';

// Page change: the screen gets "infected". Horizontal lines of corruption shoot out from the click, each row on its own
// schedule and in jerky chunks, tearing as they go; the route swaps underneath, then the lines retreat.
// The canvas holds one pixel per cell and is scaled up unsmoothed, so a QHD screen costs about one ImageData upload per frame.
const CELL = 3; // device pixels per cell
const IN = 1800, OUT = 2200, MIN_HOLD = 200, GIVE_UP = 4000;
const EDGE = 0.012; // length of a line's glowing head, in arrival-time units
const INK = 0xff0a0605, INK2 = 0xff140d0b, HOT = 0xffffffff; // ABGR; INK2 is the faint scanline between rows
const TINTS = [0xffffe000, 0xff5028ff, 0xffff6b2f, 0xff8cffa0]; // cyan, red, blue, green
const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);
const clamp = (v: number) => Math.min(1, Math.max(0, v));
const hash = (n: number) => Math.imul(n ^ (n >>> 15), 0x85ebca6b) >>> 8;

type Phase = 'idle' | 'in' | 'hold' | 'out';

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
    let arrive = new Float32Array(0), tint = new Uint32Array(0), cols = 0, rows = 0;
    let img = ctx.createImageData(1, 1), px = new Uint32Array(img.data.buffer);

    // p: how far the infection has travelled (0 to just past 1). 'in' fills what it has reached; 'out' clears it.
    const draw = (p: number) => {
      const out = phase === 'out';
      frameNo++;
      for (let y = 0; y < rows; y++) {
        // some rows tear: their front stutters back and forth a little each frame
        const h = hash(y * 31 + frameNo * 7), pj = p + (h % 7 === 0 ? ((h >> 4) % 13 - 6) * 0.008 : 0);
        const base = out ? 0 : y & 1 ? INK2 : INK, row = y * cols;
        for (let x = 0; x < cols; x++) {
          const d = out ? arrive[row + x] - pj : pj - arrive[row + x]; // distance behind the head; the head is where d = 0
          if (d >= EDGE) px[row + x] = out ? (y & 1 ? INK2 : INK) : base;
          else if (d >= 0) px[row + x] = d < EDGE * 0.25 ? HOT : tint[y];
          else px[row + x] = 0;
        }
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
      const cx = ox * k, cy = oy * k, maxDx = Math.max(cx, cols - cx), maxDy = Math.max(cy, rows - cy);
      arrive = new Float32Array(cols * rows);
      tint = new Uint32Array(rows);
      for (let y = 0, left = 0, base = 0, span = 0, step = 1, t = TINTS[0]; y < rows; y++) {
        if (left-- <= 0) { // a new band: 1 to 5 rows thick, with its own start delay, speed, chunk size and tint
          left = Math.floor(Math.random() * 5);
          base = (Math.abs(y - cy) / maxDy) * 0.3 + Math.random() * 0.45; span = 0.15 + Math.random() * 0.1; step = 20 + Math.random() * 80;
          t = TINTS[(Math.random() * TINTS.length) | 0];
        }
        tint[y] = t;
        for (let x = 0; x < cols; x++) arrive[y * cols + x] = base + (Math.floor(Math.abs(x - cx) / step) * step / maxDx) * span;
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
