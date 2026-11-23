'use client';
import { useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { reducedMotion } from '../lib/scroll';

// "Hacked" page change: the screen dissolves into glitching code, the route swaps underneath, then it burns away.
// Cells flip on a random threshold: coverage rising covers the page, coverage falling burns it off.
const CELL = 22;
const IN = 650, OUT = 950, MIN_HOLD = 380, GIVE_UP = 4000;
const GLYPHS = '01ABCDEF<>/{}$#=+';
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
    let t0 = 0, raf = 0, startPath = '', target = '', label = '';
    let rand = new Float32Array(0), cols = 0, dpr = 1, W = 0, H = 0;

    const draw = (c: number, now: number) => {
      ctx.clearRect(0, 0, W, H);
      const size = CELL * dpr;
      ctx.font = `${size * 0.7}px ui-monospace, monospace`;
      ctx.textBaseline = 'top';
      const glow = phase === 'out' ? (r: number) => r >= c && r < c + 0.05 : (r: number) => r < c && r > c - 0.05;
      for (let i = 0; i < rand.length; i++) {
        const r = rand[i];
        const x = (i % cols) * size, y = Math.floor(i / cols) * size;
        if (glow(r)) {
          ctx.fillStyle = r > 0.5 ? '#86a8ff' : '#2f6bff';
          ctx.fillRect(x, y, size, size);
        } else if (r < c) {
          ctx.fillStyle = '#05060a';
          ctx.fillRect(x, y, size + 1, size + 1);
          if (i % 5 === 0 && c > 0.2) {
            ctx.fillStyle = `rgba(53,255,140,${0.18 + ((i * 13 + (now / 90) | 0) % 5) * 0.08})`;
            ctx.fillText(GLYPHS[(i * 7 + ((now / 70) | 0)) % GLYPHS.length], x + size * 0.15, y + size * 0.1);
          }
        }
      }
      if (c > 0.05) {
        if (Math.random() < 0.6) {
          const tints = ['rgba(47,107,255,0.35)', 'rgba(255,40,80,0.25)', 'rgba(0,255,200,0.2)'];
          for (let k = 0; k < 3; k++) {
            ctx.fillStyle = tints[(Math.random() * 3) | 0];
            ctx.fillRect(0, Math.random() * H, W, (2 + Math.random() * 12) * dpr);
          }
        }
        ctx.fillStyle = `rgba(255,255,255,${0.04 * clamp(c * 2)})`;
        for (let y = 0; y < H; y += 4 * dpr) ctx.fillRect(0, y, W, dpr);
      }
      const a = clamp((c - (phase === 'out' ? 0.4 : 0.55)) / 0.2);
      if (a > 0) {
        const fs = Math.min(W * 0.045, 56 * dpr);
        ctx.font = `700 ${fs}px ui-monospace, monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const jx = Math.random() < 0.15 ? (Math.random() - 0.5) * 18 * dpr : 0;
        [['> ACCESS GRANTED', -0.6], [`> routing ${label}_`, 0.6]].forEach(([line, row]) => {
          const cx = W / 2 + jx, cy = H / 2 + (row as number) * fs * 1.3;
          ctx.globalAlpha = a;
          ctx.fillStyle = 'rgba(255,0,60,0.75)'; ctx.fillText(line as string, cx - 3 * dpr, cy);
          ctx.fillStyle = 'rgba(0,255,255,0.75)'; ctx.fillText(line as string, cx + 3 * dpr, cy);
          ctx.fillStyle = '#f3f5f9'; ctx.fillText(line as string, cx, cy);
          ctx.globalAlpha = 1;
        });
        ctx.textAlign = 'start';
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
        draw(ease(clamp(dt / IN)), now);
        if (dt >= IN) { phase = 'hold'; t0 = now; router.push(target); }
      } else if (phase === 'hold') {
        draw(1, now);
        if ((pathNow.current !== startPath && dt > MIN_HOLD) || dt > GIVE_UP) { phase = 'out'; t0 = now; }
      } else if (phase === 'out') {
        draw(1 - ease(clamp(dt / OUT)), now);
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
      e.preventDefault();
      e.stopPropagation(); // keep Next's own Link handler from navigating before the cover is up
      if (phase !== 'idle') return;
      dpr = Math.min(2, window.devicePixelRatio || 1);
      W = canvas.width = Math.ceil(innerWidth * dpr);
      H = canvas.height = Math.ceil(innerHeight * dpr);
      cols = Math.ceil(W / (CELL * dpr));
      rand = Float32Array.from({ length: cols * Math.ceil(H / (CELL * dpr)) }, Math.random);
      startPath = location.pathname;
      target = url.pathname + url.search + url.hash;
      label = url.pathname === '/' ? '/home' : url.pathname;
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
