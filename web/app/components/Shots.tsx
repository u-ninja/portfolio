'use client';
import { useEffect, useRef } from 'react';
import { reducedMotion } from '../lib/scroll';

// Click anywhere to leave a bullet impact; hold to keep firing. The spray widens the longer you hold (recoil).
// Each impact: a white flash, a dark hole with a bright rim, radiating cracks and sparks that fall under gravity.
const LIFE = 3200, RATE = 85, MAX = 160, SPREAD = 26, RAMP = 1200; // ms, ms between shots, max live shots, px, ms to full spread
const SKIP = 'input,textarea,select';

type Shot = { x: number; y: number; t: number; cracks: [number, number][]; sparks: [number, number][] };
const rnd = (a: number, b: number) => a + Math.random() * (b - a);

export function Shots() {
  const cv = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = cv.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || reducedMotion() || !matchMedia('(hover:hover) and (pointer:fine)').matches) return;

    const shots: Shot[] = [];
    let raf = 0, dpr = 1, timer = 0, held = 0, mx = 0, my = 0;

    const resize = () => {
      dpr = Math.min(2, devicePixelRatio || 1);
      canvas.width = innerWidth * dpr; canvas.height = innerHeight * dpr;
    };

    const draw = (now: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      for (let i = shots.length - 1; i >= 0; i--) {
        const s = shots[i], age = now - s.t;
        if (age > LIFE) { shots.splice(i, 1); continue; }
        const fade = age < LIFE * 0.6 ? 1 : 1 - (age - LIFE * 0.6) / (LIFE * 0.4);
        if (age < 90) { // impact flash
          ctx.fillStyle = `rgba(255,244,214,${(1 - age / 90) * 0.9})`;
          ctx.beginPath(); ctx.arc(s.x, s.y, 4 + (age / 90) * 14, 0, 7); ctx.fill();
        }
        ctx.strokeStyle = `rgba(255,255,255,${0.5 * fade})`; ctx.lineWidth = 1;
        ctx.beginPath();
        for (const [a, len] of s.cracks) {
          const l = len * Math.min(1, age / 60);
          ctx.moveTo(s.x + Math.cos(a) * 3.5, s.y + Math.sin(a) * 3.5);
          ctx.lineTo(s.x + Math.cos(a) * (3.5 + l), s.y + Math.sin(a) * (3.5 + l));
        }
        ctx.stroke();
        ctx.fillStyle = '#000'; ctx.strokeStyle = `rgba(255,255,255,${0.75 * fade})`; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.arc(s.x, s.y, 2.6, 0, 7); ctx.fill(); ctx.stroke();
        if (age < 380) { // sparks
          const sec = age / 1000;
          ctx.fillStyle = `rgba(255,${180 + ((age / 4) | 0) % 60},90,${1 - age / 380})`;
          for (const [vx, vy] of s.sparks) ctx.fillRect(s.x + vx * sec, s.y + vy * sec + 900 * sec * sec, 1.6, 1.6);
        }
      }
      raf = shots.length ? requestAnimationFrame(draw) : 0;
      if (!raf) ctx.clearRect(0, 0, innerWidth, innerHeight);
    };

    const fire = (spread: number) => {
      const a = rnd(0, 6.283), r = Math.random() * spread;
      shots.push({
        x: mx + Math.cos(a) * r, y: my + Math.sin(a) * r, t: performance.now(),
        cracks: Array.from({ length: 5 + ((Math.random() * 4) | 0) }, () => [rnd(0, 6.283), rnd(5, 20)]),
        sparks: Array.from({ length: 5 }, () => { const b = rnd(0, 6.283), v = rnd(60, 240); return [Math.cos(b) * v, Math.sin(b) * v - 80]; }),
      });
      if (shots.length > MAX) shots.shift();
      if (!raf) raf = requestAnimationFrame(draw);
    };

    const root = document.documentElement;
    const stop = () => { clearInterval(timer); timer = 0; root.classList.remove('shooting'); };
    const onDown = (e: PointerEvent) => {
      if (e.button !== 0 || e.pointerType !== 'mouse' || (e.target as Element).closest?.(SKIP)) return;
      mx = e.clientX; my = e.clientY; held = performance.now();
      stop();
      root.classList.add('shooting'); // no text selection while firing
      fire(0);
      timer = window.setInterval(() => fire(Math.min(SPREAD, ((performance.now() - held) / RAMP) * SPREAD)), RATE);
    };
    const onMove = (e: PointerEvent) => { mx = e.clientX; my = e.clientY; };

    resize();
    addEventListener('resize', resize);
    addEventListener('pointerdown', onDown, true);
    addEventListener('pointermove', onMove, { passive: true });
    addEventListener('pointerup', stop);
    addEventListener('blur', stop);
    root.addEventListener('mouseleave', stop);
    return () => {
      stop(); cancelAnimationFrame(raf);
      removeEventListener('resize', resize);
      removeEventListener('pointerdown', onDown, true);
      removeEventListener('pointermove', onMove);
      removeEventListener('pointerup', stop);
      removeEventListener('blur', stop);
      root.removeEventListener('mouseleave', stop);
    };
  }, []);

  return <canvas ref={cv} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[55] h-full w-full" />;
}
