'use client';
import { useEffect, useRef } from 'react';
import { reducedMotion } from '../lib/scroll';

// A crosshair that sits exactly on the pointer. Its arms spring open over clickable things (and turn 45°),
// and snap shut on press. It inverts whatever is beneath it, so it reads on any background.
const TARGET = 'a,button,[role="button"],.btn,summary,label,select';
const FIELD = 'input,textarea'; // text fields keep the native I-beam
const K = 420, C = 24; // spring stiffness and damping for gap and rotation
const ARMS = [0, 90, 180, 270];

type S = { v: number; x: number };
const spring = (s: S, to: number, dt: number) => {
  s.v += (K * (to - s.x) - C * s.v) * dt;
  s.x += s.v * dt;
};

export function Cursor() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || reducedMotion() || !matchMedia('(hover:hover) and (pointer:fine)').matches) return;
    const arms = [...el.querySelectorAll<HTMLElement>('[data-arm]')];
    const gap: S = { x: 7, v: 0 }, rot: S = { x: 0, v: 0 };
    let mx = -100, my = -100, kind: 'free' | 'target' | 'hide' = 'free', down = false, dirty = true, shown = false, last = performance.now(), raf = 0;

    const probe = () => {
      dirty = false;
      const under = document.elementFromPoint(mx, my);
      kind = under?.closest(`${FIELD},[data-cursor="hide"]`) ? 'hide' : under?.closest(TARGET) ? 'target' : 'free';
      el.style.opacity = kind === 'hide' || !shown ? '0' : '1';
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      mx = e.clientX; my = e.clientY; shown = true; dirty = true;
      el.style.transform = `translate3d(${mx}px,${my}px,0)`;
    };
    const onLeave = () => { shown = false; el.style.opacity = '0'; };
    const press = (v: boolean) => () => { down = v; };
    const markDirty = () => { dirty = true; };

    const frame = (now: number) => {
      const dt = Math.min(0.033, (now - last) / 1000);
      last = now;
      if (dirty) probe();
      spring(gap, (kind === 'target' ? 15 : 7) * (down ? 0.45 : 1), dt);
      spring(rot, kind === 'target' ? 45 : 0, dt);
      const g = Math.max(0, gap.x);
      arms.forEach((a, i) => { a.style.transform = `rotate(${ARMS[i] + rot.x}deg) translateY(${-g}px)`; });
      raf = requestAnimationFrame(frame);
    };

    document.documentElement.classList.add('has-cursor');
    addEventListener('pointermove', onMove, { passive: true });
    addEventListener('pointerdown', press(true));
    addEventListener('pointerup', press(false));
    addEventListener('scroll', markDirty, { passive: true });
    document.documentElement.addEventListener('mouseleave', onLeave);
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove('has-cursor');
      removeEventListener('pointermove', onMove);
      removeEventListener('scroll', markDirty);
      document.documentElement.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <div ref={root} aria-hidden="true" className="cursor">
      <i className="cursor-dot" />
      {ARMS.map((a) => <i key={a} data-arm className="cursor-arm" />)}
    </div>
  );
}
