'use client';
import { useEffect, useRef } from 'react';
import { reducedMotion } from '../lib/scroll';

// A crosshair that sits exactly on the pointer. Its arms spring open over clickable things (and turn 45°),
// and snap shut on press. A ring chases it on springs, stretching along its velocity, and snaps square around
// whatever you hover. Both invert what is beneath them, so they read on any background.
const TARGET = 'a,button,[role="button"],.btn,summary,label,select';
const FIELD = 'input,textarea'; // text fields keep the native I-beam
const K = 420, C = 24; // spring stiffness and damping for gap and rotation
const KF = 180, CF = 16, KS = 320, CS = 26; // ring: follow and size springs
const ARMS = [0, 90, 180, 270];

type S = { v: number; x: number };
const spring = (s: S, to: number, dt: number, k = K, c = C) => {
  s.v += (k * (to - s.x) - c * s.v) * dt;
  s.x += s.v * dt;
};

export function Cursor() {
  const root = useRef<HTMLDivElement>(null);
  const ringEl = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    const ring = ringEl.current;
    if (!el || !ring || reducedMotion() || !matchMedia('(hover:hover) and (pointer:fine)').matches) return;
    const arms = [...el.querySelectorAll<HTMLElement>('[data-arm]')];
    const gap: S = { x: 7, v: 0 }, rot: S = { x: 0, v: 0 };
    const rx: S = { x: -100, v: 0 }, ry: S = { x: -100, v: 0 }, rw: S = { x: 34, v: 0 }, rh: S = { x: 34, v: 0 }, rr: S = { x: 17, v: 0 };
    let hover: Element | null = null, mx = -100, my = -100, kind: 'free' | 'target' | 'hide' = 'free', down = false, dirty = true, shown = false, last = performance.now(), raf = 0;

    const probe = () => {
      dirty = false;
      const under = document.elementFromPoint(mx, my);
      hover = under?.closest(TARGET) ?? null;
      kind = under?.closest(`${FIELD},[data-cursor="hide"]`) ? 'hide' : hover ? 'target' : 'free';
      el.style.opacity = ring.style.opacity = kind === 'hide' || !shown ? '0' : '1';
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      mx = e.clientX; my = e.clientY; dirty = true;
      if (!shown) { rx.x = mx; ry.x = my; shown = true; }
      el.style.transform = `translate3d(${mx}px,${my}px,0)`;
    };
    const onLeave = () => { shown = false; el.style.opacity = ring.style.opacity = '0'; };
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

      // The ring hugs a hovered element (leaning a little toward the pointer); otherwise it trails the pointer as a circle.
      let tx = mx, ty = my, tw = down ? 26 : 34, th = tw, tr = tw / 2;
      if (kind === 'target' && hover) {
        const b = hover.getBoundingClientRect();
        tx = b.left + b.width / 2 + (mx - (b.left + b.width / 2)) * 0.1;
        ty = b.top + b.height / 2 + (my - (b.top + b.height / 2)) * 0.1;
        tw = b.width + 16; th = b.height + 16; tr = 0;
      }
      rx.v += (KF * (tx - rx.x) - CF * rx.v) * dt; rx.x += rx.v * dt;
      ry.v += (KF * (ty - ry.x) - CF * ry.v) * dt; ry.x += ry.v * dt;
      spring(rw, tw, dt, KS, CS); spring(rh, th, dt, KS, CS); spring(rr, tr, dt, KS, CS);
      const free = kind === 'target' ? 0 : 1, stretch = Math.min(0.6, Math.hypot(rx.v, ry.v) / 2400) * free, ang = Math.atan2(ry.v, rx.v);
      ring.style.width = `${Math.max(2, rw.x)}px`; ring.style.height = `${Math.max(2, rh.x)}px`; ring.style.borderRadius = `${Math.max(0, rr.x)}px`;
      ring.style.transform = `translate3d(${rx.x - rw.x / 2}px,${ry.x - rh.x / 2}px,0) rotate(${ang}rad) scale(${1 + stretch},${1 - stretch * 0.45}) rotate(${-ang}rad)`;
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
    <>
      <div ref={ringEl} aria-hidden="true" className="cursor-ring" />
      <div ref={root} aria-hidden="true" className="cursor">
        <i className="cursor-dot" />
        {ARMS.map((a) => <i key={a} data-arm className="cursor-arm" />)}
      </div>
    </>
  );
}
