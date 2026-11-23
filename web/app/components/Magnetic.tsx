'use client';
import { useEffect, useRef } from 'react';
import { reducedMotion } from '../lib/scroll';

// Wrapped element is pulled toward the pointer on a spring and settles back with overshoot.
export function Magnetic({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion() || !matchMedia('(hover:hover)').matches) return;
    let x = 0, y = 0, vx = 0, vy = 0, tx = 0, ty = 0, raf = 0, last = 0;
    const step = (t: number) => {
      const dt = Math.min((t - last) / 1000, 0.032); last = t;
      vx += (170 * (tx - x) - 12 * vx) * dt; vy += (170 * (ty - y) - 12 * vy) * dt;
      x += vx * dt; y += vy * dt;
      el.style.transform = `translate(${x}px,${y}px)`;
      if (Math.abs(vx) + Math.abs(vy) + Math.abs(tx - x) + Math.abs(ty - y) > 0.05) raf = requestAnimationFrame(step);
      else { raf = 0; el.style.transform = ''; x = y = 0; }
    };
    const go = () => { if (!raf) { last = performance.now(); raf = requestAnimationFrame(step); } };
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      tx = (e.clientX - (r.left + r.width / 2)) * 0.35; ty = (e.clientY - (r.top + r.height / 2)) * 0.35; go();
    };
    const leave = () => { tx = ty = 0; go(); };
    el.addEventListener('pointermove', move); el.addEventListener('pointerleave', leave);
    return () => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave); cancelAnimationFrame(raf); };
  }, []);
  return <span ref={ref} className="inline-block">{children}</span>;
}
