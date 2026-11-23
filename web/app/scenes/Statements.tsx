'use client';
import { useCallback, useRef } from 'react';
import { useScrollProgress } from '../lib/scroll';

// Each claim is paired with the line from my work that backs it.
const statements = [
  { text: "I don't just write code.", fx: 'rise', note: 'I lead 3–5 engineers and set the team’s code review workflow and standards.' },
  { text: 'I engineer systems.', fx: 'depth', note: 'Warehouse platforms wired into SAP S/4HANA and SCALE WMS, live over Socket.IO.' },
  { text: 'I build products.', fx: 'wipe', note: 'Teeme: a project management SaaS I designed, built and launched solo.' },
  { text: 'I solve difficult problems.', fx: 'type', note: '40% more data-entry throughput from rewriting nested legacy queries.' },
];

export function Statements() {
  const ref = useRef<HTMLElement>(null);
  const onScroll = useCallback((p: number) => {
    ref.current?.querySelectorAll<HTMLElement>('.stmt').forEach((el, i) => {
      el.style.setProperty('--t', (p * (statements.length - 1) + 0.6 - i).toFixed(4));
    });
  }, []);
  useScrollProgress(ref, onScroll);

  return (
    <section
      id="story"
      ref={ref}
      data-shape="lattice"
      data-alpha="0.42" data-scale="0.62"
      data-stops={statements.map((_, i) => i / (statements.length - 1)).join(',')}
      aria-label="What I do"
      className="relative"
      style={{ height: `${(statements.length - 1) * 100 + 100}vh` }}
    >
      <div className="sticky top-0 h-svh overflow-hidden" style={{ perspective: '900px' }}>
        {statements.map((s) => {
          let i = 0;
          return (
            <div key={s.text} className={`stmt stmt-${s.fx}`}>
              <h2 aria-label={s.text} className="display text-[clamp(2.6rem,9.5vw,9rem)]">
                {s.text.split(' ').map((word, wi) => (
                  <span key={wi} aria-hidden="true">
                    <span className="w">
                      {word.split('').map((ch) => (
                        <span key={i} className="ch" style={{ '--i': i++ } as React.CSSProperties}>{ch}</span>
                      ))}
                    </span>{' '}
                  </span>
                ))}
              </h2>
              <p className="stmt-note mt-8 max-w-xl font-mono text-sm leading-relaxed text-signal-soft md:text-base">
                <span className="text-mute">{'// '}</span>
                {s.note}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
