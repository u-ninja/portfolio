'use client';
import { useEffect, useRef } from 'react';
import { reducedMotion } from '../lib/scroll';

// A ring that chases the pointer on springs with gravity, stretching along its velocity.
// Over interactive elements it morphs into their outline; the section underneath changes its look.
const TARGET = 'a,button,[role="button"],.btn,summary,label,input,textarea,select';
const SIZE: Record<string, number> = { top: 22, story: 72, skills: 30, work: 44, systems: 26, experience: 22, play: 18, contact: 56 };
const K = 220, C = 18, G = 1400; // follow stiffness, damping, gravity (px/s²)
const KS = 320, CS = 26; // size springs

type S = { v: number; x: number };
const spring = (s: S, to: number, k: number, c: number, dt: number) => {
  s.v += (k * (to - s.x) - c * s.v) * dt;
  s.x += s.v * dt;
};

export function Cursor() {
  const el = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ring = el.current;
    if (!ring || reducedMotion() || !matchMedia('(hover:hover) and (pointer:fine)').matches) return;
    const mouse = { x: -100, y: -100 };
    const x: S = { x: -100, v: 0 }, y: S = { x: -100, v: 0 };
    const w: S = { x: 22, v: 0 }, h: S = { x: 22, v: 0 }, r: S = { x: 11, v: 0 };
    let morph = 0; // 0 free, 1 locked to an element
    let hover: Element | null = null;
    let ctx = '';
    let down = false;
    let dirty = true;
    let seen = false;
    let last = performance.now();
    let raf = 0;

    const probe = () => {
      dirty = false;
      const under = document.elementFromPoint(mouse.x, mouse.y);
      hover = under?.closest(TARGET) ?? null;
      const section = under?.closest('section[id]')?.id ?? 'top';
      const kind = under?.closest('[data-cursor="hide"]') ? 'hide' : hover ? (hover.matches('input,textarea') ? 'text' : 'target') : under?.closest('p') ? 'text' : section;
      if (kind !== ctx) {
        ctx = kind;
        ring.dataset.ctx = kind;
      }
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      if (!seen) {
        seen = true;
        x.x = mouse.x; y.x = mouse.y;
        ring.style.opacity = '1';
      }
      dirty = true;
    };
    const onLeave = () => { ring.style.opacity = '0'; seen = false; };
    const onDown = () => { down = true; };
    const onUp = () => { down = false; };
    const markDirty = () => { dirty = true; };

    const frame = (now: number) => {
      const dt = Math.min(0.033, (now - last) / 1000);
      last = now;
      if (dirty) probe();

      let tx = mouse.x, ty = mouse.y, tw: number, th: number, tr: number;
      if (hover && ctx === 'target') {
        const b = hover.getBoundingClientRect();
        const pad = 8;
        // The ring hugs the element but leans a little toward the pointer.
        tx = b.left + b.width / 2 + (mouse.x - (b.left + b.width / 2)) * 0.1;
        ty = b.top + b.height / 2 + (mouse.y - (b.top + b.height / 2)) * 0.1;
        tw = b.width + pad * 2;
        th = b.height + pad * 2;
        tr = Math.min(th / 2, (parseFloat(getComputedStyle(hover).borderTopLeftRadius) || 0) + pad);
      } else if (ctx === 'text') {
        tw = 3; th = 26; tr = 2;
      } else {
        tw = th = (SIZE[ctx] ?? 22) * (down ? 0.8 : 1);
        tr = tw / 2;
      }
      const free = ctx === 'target' ? 0 : 1;
      morph += (free - morph) * Math.min(1, dt * 14);

      // Gravity only pulls the free ring, so it sags below the pointer and swings when you move.
      const g = G * free;
      x.v += (K * (tx - x.x) - C * x.v) * dt;
      y.v += (K * (ty - y.x) - C * y.v + g) * dt;
      x.x += x.v * dt;
      y.x += y.v * dt;
      spring(w, tw, KS, CS, dt);
      spring(h, th, KS, CS, dt);
      spring(r, tr, KS, CS, dt);

      const speed = Math.hypot(x.v, y.v);
      const stretch = Math.min(0.7, speed / 2200) * morph;
      const angle = Math.atan2(y.v, x.v);
      ring.style.width = `${Math.max(2, w.x)}px`;
      ring.style.height = `${Math.max(2, h.x)}px`;
      ring.style.borderRadius = `${Math.max(0, r.x)}px`;
      ring.style.transform = `translate3d(${x.x - w.x / 2}px,${y.x - h.x / 2}px,0) rotate(${angle}rad) scale(${1 + stretch},${1 - stretch * 0.45}) rotate(${-angle}rad)`;
      raf = requestAnimationFrame(frame);
    };

    addEventListener('pointermove', onMove, { passive: true });
    addEventListener('pointerdown', onDown);
    addEventListener('pointerup', onUp);
    addEventListener('scroll', markDirty, { passive: true });
    document.documentElement.addEventListener('mouseleave', onLeave);
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener('pointermove', onMove);
      removeEventListener('pointerdown', onDown);
      removeEventListener('pointerup', onUp);
      removeEventListener('scroll', markDirty);
      document.documentElement.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return <div ref={el} aria-hidden="true" className="cursor" />;
}
