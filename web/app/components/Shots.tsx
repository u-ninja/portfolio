'use client';
import { useEffect, useRef } from 'react';
import { reducedMotion } from '../lib/scroll';

// Click anywhere to leave a bullet impact; hold to keep firing. The spray widens the longer you hold (recoil).
// Each impact corrupts the screen: a white flash, a dead-pixel hole with an RGB split, flickering data blocks and tear bars
// snapped to a pixel grid, and bits that fall under gravity. A few blocks stay as residue until the mark fades.
const LIFE = 3200, RATE = 85, MAX = 100, SPREAD = 14, RAMP = 1200; // ms, ms between shots, max live shots, px, ms to full spread
const SKIP = 'input,textarea,select';

type Shot = { x: number; y: number; t: number; blocks: [number, number, number, number, string][]; sparks: [number, number][] };
const TINTS = ['#00e0ff', '#ff2850', '#2f6bff', '#a0ff8c', '#ffffff'];
const snap = (v: number) => Math.round(v / 3) * 3; // blocks sit on a 3px grid, like screen pixels
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
          ctx.beginPath(); ctx.arc(s.x, s.y, 3 + (age / 90) * 7, 0, 7); ctx.fill();
        }
        const step = (age / 55) | 0, live = age < 700;
        s.blocks.forEach(([dx, dy, w, h, c], i) => {
          // while live each block flickers on and off, and every third one jitters sideways; after that only the first four stay
          if (live ? (Math.imul(i * 131 + step * 977, 0x9e3779b1) >>> 28) % 4 === 0 : i >= 4) return;
          ctx.globalAlpha = fade * (live ? 1 : 0.8);
          ctx.fillStyle = c;
          ctx.fillRect(s.x + dx + (live && i % 3 === 0 ? ((step * 37 + i * 11) % 5 - 2) * 3 : 0), s.y + dy, w, h);
        });
        ctx.globalAlpha = fade;
        ctx.fillStyle = '#ff2850'; ctx.fillRect(s.x - 3, s.y - 2, 4, 4);
        ctx.fillStyle = '#00e0ff'; ctx.fillRect(s.x - 1, s.y - 2, 4, 4);
        ctx.fillStyle = '#000'; ctx.fillRect(s.x - 2, s.y - 2, 4, 4);
        ctx.globalAlpha = 1;
        if (age < 380) { // sparks
          const sec = age / 1000;
          ctx.fillStyle = `rgba(255,255,255,${1 - age / 380})`;
          for (const [vx, vy] of s.sparks) ctx.fillRect(s.x + vx * sec, s.y + vy * sec + 900 * sec * sec, 2, 2);
        }
      }
      raf = shots.length ? requestAnimationFrame(draw) : 0;
      if (!raf) ctx.clearRect(0, 0, innerWidth, innerHeight);
    };

    const fire = (spread: number) => {
      const a = rnd(0, 6.283), r = Math.random() * spread;
      shots.push({
        x: mx + Math.cos(a) * r, y: my + Math.sin(a) * r, t: performance.now(),
        blocks: Array.from({ length: 5 + ((Math.random() * 4) | 0) }, () => {
          const tear = Math.random() < 0.12; // a few thin bars, like a torn scanline
          return [snap(rnd(-15, 15)), snap(rnd(-9, 9)), snap(tear ? rnd(24, 60) : rnd(3, 18)), tear ? 3 : snap(rnd(3, 6)), TINTS[(Math.random() * TINTS.length) | 0]];
        }),
        sparks: Array.from({ length: 3 }, () => { const b = rnd(0, 6.283), v = rnd(40, 140); return [Math.cos(b) * v, Math.sin(b) * v - 80]; }),
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
