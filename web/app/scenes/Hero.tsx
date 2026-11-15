'use client';
import { useRef } from 'react';
import { useScrollProgress } from '../lib/scroll';

const lines = ['I build things', 'that move the', 'world forward.'];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  useScrollProgress(ref, undefined, 'pass');

  return (
    <section
      id="top"
      ref={ref}
      data-shape="knot"
      data-alpha="1"
      data-x="0.46" data-scale="0.9"
      className="relative flex min-h-svh flex-col justify-end overflow-hidden px-6 pb-14 pt-28 md:px-10 md:pb-20"
    >
      <div className="hero-inner mx-auto w-full max-w-6xl">
        <p className="fade-in mb-6 font-mono text-sm text-signal-soft" style={{ '--d': 0 } as React.CSSProperties}>
          <span className="text-mute">$</span> ullas --run<span className="caret">▍</span>
        </p>

        <h1 className="display mb-10 text-[clamp(3.1rem,11.5vw,10.5rem)]">
          {lines.map((line, i) => (
            <span key={line} className="line-mask">
              <span style={{ '--d': i + 1 } as React.CSSProperties}>{line}</span>
            </span>
          ))}
        </h1>

        <div
          className="fade-in flex flex-col gap-8 md:flex-row md:items-end md:justify-between"
          style={{ '--d': 6 } as React.CSSProperties}
        >
          <div className="max-w-md">
            <p className="mb-2 text-xl md:text-2xl">Ullas JS, Senior Software Engineer.</p>
            <p className="leading-relaxed text-mute">
              Product builder and systems thinker. Nearly four years shipping production platforms in React, Next.js,
              TypeScript and Node.js. Today I lead the team behind SAP-integrated warehouse systems, and I run my own
              SaaS, Teeme.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href="#work" className="btn btn-solid">See the work</a>
            <a href="/Ullas_JS_Resume.pdf" download className="btn">Download résumé</a>
          </div>
        </div>
      </div>

      <div aria-hidden="true" className="absolute bottom-0 left-1/2 hidden h-12 w-px md:block">
        <span className="scroll-cue block h-full w-px bg-signal-soft" />
      </div>
    </section>
  );
}
