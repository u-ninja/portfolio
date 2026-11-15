'use client';
import { useEffect, useSyncExternalStore, type RefObject } from 'react';

// One scroll listener and one rAF for the whole page; every scene subscribes here.
type Mode = 'pin' | 'pass';
type Sub = { cb: (p: number) => void; mode: Mode; last: number };
const subs = new Map<HTMLElement, Sub>();
let queued = false;

function measure() {
  queued = false;
  const vh = window.innerHeight;
  subs.forEach((s, el) => {
    const r = el.getBoundingClientRect();
    // pin: 0→1 while a tall section's sticky child is held. pass: 0→1 as the element crosses the viewport.
    const raw = s.mode === 'pin' ? -r.top / Math.max(1, r.height - vh) : (vh - r.top) / (vh + r.height);
    const p = Math.min(1, Math.max(0, raw));
    if (p !== s.last) {
      s.last = p;
      s.cb(p);
    }
  });
}

function queue() {
  if (queued) return;
  queued = true;
  requestAnimationFrame(measure);
}

/** Reports scroll progress for `ref`. Without `cb` it writes the CSS variable `--p` on the element. `cb` must be stable. */
export function useScrollProgress(ref: RefObject<HTMLElement | null>, cb?: (p: number) => void, mode: Mode = 'pin') {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (subs.size === 0) {
      window.addEventListener('scroll', queue, { passive: true });
      window.addEventListener('resize', queue);
    }
    subs.set(el, { cb: cb ?? ((p) => el.style.setProperty('--p', p.toFixed(4))), mode, last: -1 });
    queue();
    return () => {
      subs.delete(el);
      if (subs.size === 0) {
        window.removeEventListener('scroll', queue);
        window.removeEventListener('resize', queue);
      }
    };
  }, [ref, cb, mode]);
}

export const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const noop = () => () => {};
/** False on the server and for users who have not asked for reduced motion. */
export function useReducedMotion() {
  return useSyncExternalStore(noop, reducedMotion, () => false);
}
