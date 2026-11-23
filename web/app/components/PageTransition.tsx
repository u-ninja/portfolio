'use client';
import { useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { reducedMotion } from '../lib/scroll';

// Page change: a quick pixel wipe covers the screen, the route swaps underneath, then it clears.
// Each cell flips by its distance from the click (plus a little noise): the cover spreads out from where you clicked,
// and the clearing opens up from the same point.
const CELL = 36;
const IN = 380, OUT = 520, MIN_HOLD = 100, GIVE_UP = 4000;
const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);
const clamp = (v: number) => Math.min(1, Math.max(0, v));

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
    let t0 = 0, raf = 0, startPath = '', target = '';
    let rand = new Float32Array(0), cols = 0, dpr = 1, W = 0, H = 0;

    const draw = (c: number) => {
      ctx.clearRect(0, 0, W, H);
      const size = CELL * dpr;
      const out = phase === 'out';
      const glow = (v: number) => (out ? v >= c && v < c + 0.05 : v < c && v > c - 0.05);
      for (let i = 0; i < rand.length; i++) {
        const r = out ? 1 - rand[i] : rand[i]; // on the way out, cells nearest the click clear first
        const x = (i % cols) * size, y = Math.floor(i / cols) * size;
        if (glow(r)) {
          ctx.fillStyle = r > 0.5 ? '#86a8ff' : '#2f6bff';
          ctx.fillRect(x, y, size, size);
        } else if (r < c) {
          ctx.fillStyle = '#05060a';
          ctx.fillRect(x, y, size + 1, size + 1);
        }
      }
    };

    const finish = () => {
      phase = 'idle';
      canvas.style.display = 'none';
      document.documentElement.style.overflow = '';
    };

    const frame = (now: number) => {
      const dt = now - t0;
      if (phase === 'in') {
        draw(ease(clamp(dt / IN)));
        if (dt >= IN) { phase = 'hold'; t0 = now; router.push(target); }
      } else if (phase === 'hold') {
        draw(1);
        if ((pathNow.current !== startPath && dt > MIN_HOLD) || dt > GIVE_UP) { phase = 'out'; t0 = now; }
      } else if (phase === 'out') {
        draw(1 - ease(clamp(dt / OUT)));
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
      dpr = Math.min(2, window.devicePixelRatio || 1);
      W = canvas.width = Math.ceil(innerWidth * dpr);
      H = canvas.height = Math.ceil(innerHeight * dpr);
      cols = Math.ceil(W / (CELL * dpr));
      const reach = Math.max(Math.hypot(ox, oy), Math.hypot(innerWidth - ox, oy), Math.hypot(ox, innerHeight - oy), Math.hypot(innerWidth - ox, innerHeight - oy));
      rand = Float32Array.from({ length: cols * Math.ceil(H / (CELL * dpr)) }, (_, i) => {
        const cx = ((i % cols) + 0.5) * CELL, cy = (Math.floor(i / cols) + 0.5) * CELL;
        return (Math.hypot(cx - ox, cy - oy) / reach) * 0.9 + Math.random() * 0.1;
      });
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

  return <canvas ref={cv} aria-hidden="true" style={{ display: 'none' }} className="pointer-events-none fixed inset-0 z-[90] h-full w-full" />;
}
