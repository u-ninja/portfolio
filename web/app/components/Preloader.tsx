'use client';
import { useEffect, useState } from 'react';
import { reducedMotion } from '../lib/scroll';

// A counter that follows real loading (fonts, then the window load event), over a progress line.
// It then lifts away like a curtain. Plays on every full page load, not on in-app navigation.
let played = false;
const MIN = 1100; // never flash by faster than this

export function Preloader() {
  const [pct, setPct] = useState(0);
  const [phase, setPhase] = useState<'run' | 'lift' | 'gone'>(() => (played ? 'gone' : 'run'));

  useEffect(() => {
    if (played) return;
    if (reducedMotion()) {
      played = true;
      return setPhase('gone');
    }
    let fonts = false, loaded = document.readyState === 'complete';
    document.fonts.ready.then(() => { fonts = true; });
    const onLoad = () => { loaded = true; };
    if (!loaded) window.addEventListener('load', onLoad);

    const t0 = performance.now();
    let last = t0, shown = 0, raf = 0;
    const timers: number[] = [];
    const tick = (now: number) => {
      const target = 30 + (fonts ? 30 : 0) + (loaded ? 40 : 0);
      shown += (target - shown) * (1 - Math.exp(-(now - last) / 260)); // ease toward what has actually loaded
      last = now;
      const done = target === 100 && shown > 99.4 && now - t0 > MIN;
      setPct(done ? 100 : Math.floor(shown));
      if (!done) return void (raf = requestAnimationFrame(tick));
      played = true;
      timers.push(window.setTimeout(() => setPhase('lift'), 300), window.setTimeout(() => setPhase('gone'), 1200));
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('load', onLoad);
      timers.forEach(clearTimeout);
    };
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
      <p className="absolute bottom-6 left-6 font-mono text-xs leading-5 text-mute md:bottom-10 md:left-10">
        <span className="block">{pct < 100 ? 'Loading' : 'Ready'}</span>
        <span className="block opacity-60">portfolio</span>
      </p>
      <span className="absolute inset-x-0 bottom-0 h-1 origin-left bg-signal" style={{ transform: `scaleX(${pct / 100})` }} />
    </div>
  );
}
