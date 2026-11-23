'use client';
import { useEffect } from 'react';
import { reducedMotion } from '../lib/scroll';

// Pinned scenes list their beats as `data-stops` (scroll progress 0→1). Inside one, a wheel tick,
// swipe or key press glides to the next beat, and a pause settles on the nearest, so a scene is never left half-played.
const EPS = 0.01;
const DUR = 750;
const ease = (t: number) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2);

type Pin = { top: number; range: number; p: number; stops: number[] };

function pinned(): Pin | null {
  const vh = window.innerHeight;
  for (const el of document.querySelectorAll<HTMLElement>('[data-stops]')) {
    const r = el.getBoundingClientRect();
    if (r.height < vh * 1.5 || r.top > 0.5 || r.bottom < vh - 0.5) continue; // not tall enough (mobile) or not held
    const range = r.height - vh;
    return { top: window.scrollY + r.top, range, p: -r.top / range, stops: el.dataset.stops!.split(',').map(Number) };
  }
  return null;
}

export function StepScroll() {
  useEffect(() => {
    if (reducedMotion()) return;
    let busy = false;
    let lastWheel = 0;
    let touchY: number | null = null;
    let timer = 0;

    const glide = (pin: Pin, to: number) => {
      const from = window.scrollY;
      const dist = pin.top + to * pin.range - from;
      const t0 = performance.now();
      busy = true;
      const tick = (now: number) => {
        const k = Math.min(1, (now - t0) / DUR);
        window.scrollTo({ top: from + dist * ease(k), behavior: 'instant' });
        if (k < 1) requestAnimationFrame(tick);
        else busy = false;
      };
      requestAnimationFrame(tick);
    };

    // Returns true when the gesture was ours (inside a pin with a beat left in that direction).
    const step = (dir: 1 | -1) => {
      const pin = pinned();
      if (!pin) return false;
      const to = dir > 0 ? pin.stops.find((s) => s > pin.p + EPS) : [...pin.stops].reverse().find((s) => s < pin.p - EPS);
      if (to === undefined) return false;
      if (!busy) glide(pin, to);
      return true;
    };

    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || Math.abs(e.deltaY) < Math.abs(e.deltaX) || Math.abs(e.deltaY) < 2) return;
      const now = performance.now();
      const fresh = now - lastWheel > 100; // trackpad inertia is one stream; only its first event may step
      lastWheel = now;
      const dir = e.deltaY > 0 ? 1 : -1;
      if (!pinned() || (!busy && fresh ? !step(dir) : !hasBeat(dir))) return;
      e.preventDefault();
    };
    const hasBeat = (dir: 1 | -1) => {
      const pin = pinned();
      return !!pin && pin.stops.some((s) => (dir > 0 ? s > pin.p + EPS : s < pin.p - EPS));
    };

    const onTouchStart = (e: TouchEvent) => { touchY = e.touches[0].clientY; };
    const onTouchMove = (e: TouchEvent) => {
      if (touchY === null) return;
      const dy = touchY - e.touches[0].clientY;
      if (!hasBeat(dy > 0 ? 1 : -1)) return;
      e.preventDefault();
      if (Math.abs(dy) > 40 && !busy) {
        step(dy > 0 ? 1 : -1);
        touchY = null;
      }
    };
    const onTouchEnd = () => { touchY = null; };

    const onKey = (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey || e.metaKey || (e.target as HTMLElement).closest('input,textarea,select,button,a,[contenteditable]')) return;
      const dir = ['ArrowDown', 'PageDown', ' '].includes(e.key) ? (e.shiftKey && e.key === ' ' ? -1 : 1) : ['ArrowUp', 'PageUp'].includes(e.key) ? -1 : 0;
      if (dir && step(dir as 1 | -1)) e.preventDefault();
    };

    const settle = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        const pin = pinned();
        if (!pin || busy || touchY !== null) return;
        const to = pin.stops.reduce((a, b) => (Math.abs(b - pin.p) < Math.abs(a - pin.p) ? b : a));
        if (Math.abs(to - pin.p) > EPS) glide(pin, to);
      }, 160);
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    window.addEventListener('keydown', onKey);
    window.addEventListener('scroll', settle, { passive: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('scroll', settle);
    };
  }, []);
  return null;
}
