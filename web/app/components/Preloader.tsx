'use client';
import { useEffect, useState } from 'react';
import { reducedMotion } from '../lib/scroll';

// Count to 100 over a progress line, then lift away like a curtain. Plays once per tab session.
const TIME = 1500;
const ease = (t: number) => 1 - (1 - t) ** 3;

export function Preloader() {
  const [pct, setPct] = useState(0);
  const [phase, setPhase] = useState<'run' | 'lift' | 'gone'>('run');

  useEffect(() => {
    let seen = false;
    try { seen = sessionStorage.getItem('preloaded') === '1'; } catch {}
    if (seen || reducedMotion()) return setPhase('gone');
    const t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const k = Math.min(1, (now - t0) / TIME);
      setPct(Math.round(ease(k) * 100));
      if (k < 1) raf = requestAnimationFrame(tick);
      else {
        try { sessionStorage.setItem('preloaded', '1'); } catch {}
        setTimeout(() => setPhase('lift'), 250);
        setTimeout(() => setPhase('gone'), 1150);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = phase === 'run' ? 'hidden' : '';
    return () => { document.documentElement.style.overflow = ''; };
  }, [phase]);

  if (phase === 'gone') return null;
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-[100] bg-ink transition-transform duration-[900ms] ease-[cubic-bezier(0.76,0,0.24,1)]"
      style={{ transform: phase === 'lift' ? 'translateY(-100%)' : 'none' }}
    >
      <p className="display absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[clamp(1.6rem,4vw,3rem)]">Ullas JS</p>
      <p className="absolute bottom-6 right-6 font-mono leading-none md:bottom-10 md:right-10">
        <span className="text-[clamp(4rem,16vw,12rem)]">{String(pct).padStart(3, '0')}</span>
        <span className="align-top text-2xl text-mute">%</span>
      </p>
      <p className="absolute bottom-6 left-6 font-mono text-xs text-mute md:bottom-10 md:left-10">loading portfolio</p>
      <span className="absolute inset-x-0 bottom-0 h-1 origin-left bg-signal" style={{ transform: `scaleX(${pct / 100})` }} />
    </div>
  );
}
