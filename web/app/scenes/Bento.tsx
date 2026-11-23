'use client';
import { useRef } from 'react';
import { SceneHead } from './SceneHead';

// Every figure here comes from the Experience scene, so the two stay in agreement.
const label = 'font-mono text-xs text-mute';
const big = 'display text-[clamp(4rem,9vw,8rem)] leading-[0.85]';
const stack = ['React', 'Next.js', 'TypeScript', 'Node.js', 'Azure', 'PostgreSQL', 'Socket.IO', 'Claude API'];
const bars = [38, 52, 44, 70, 58, 82, 64, 90, 74, 100, 86, 96];

export function Bento() {
  const grid = useRef<HTMLDivElement>(null);
  // Each tile gets the pointer position relative to itself; the CSS spotlight reads it.
  const track = (e: React.PointerEvent) => {
    grid.current?.querySelectorAll<HTMLElement>('.bento-tile').forEach((t) => {
      const r = t.getBoundingClientRect();
      t.style.setProperty('--mx', `${e.clientX - r.left}px`);
      t.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  };

  return (
    <section id="numbers" data-shape="dust" data-alpha="0.15" className="relative px-6 py-24 md:px-10 md:py-36">
      <div className="mx-auto max-w-6xl">
        <SceneHead fn="stats --live" title="By the numbers" />
        <div ref={grid} onPointerMove={track} className="mt-14 grid auto-rows-[minmax(13rem,auto)] gap-3 md:mt-20 md:grid-cols-12 md:gap-4">
          <article className="bento-tile flex flex-col justify-between md:col-span-7 md:row-span-2">
            <p className={label}>releases / week</p>
            <div>
              <div aria-hidden="true" className="bento-bars mb-8 flex h-28 items-end gap-1.5 md:h-44">
                {bars.map((h, i) => (
                  <span key={i} style={{ '--h': `${h}%`, '--i': i } as React.CSSProperties} className="flex-1 bg-signal/70" />
                ))}
              </div>
              <p className={big}>29</p>
              <p className="mt-4 max-w-sm text-mute">Shipped to production about 29 times a week, kept stable with hotfix branches and revision-based deploys.</p>
            </div>
          </article>

          <article className="bento-tile flex flex-col justify-between md:col-span-5">
            <p className={label}>data-entry throughput</p>
            <div>
              <p className={big}>+40%</p>
              <div aria-hidden="true" className="mt-5 h-px w-full bg-line"><span className="bento-fill block h-px bg-signal-soft" /></div>
              <p className="mt-4 text-mute">From rewriting nested legacy queries and redesigning batch processing.</p>
            </div>
          </article>

          <article className="bento-tile flex flex-col justify-between md:col-span-5">
            <p className={label}>integrations</p>
            <div>
              <div aria-hidden="true" className="mb-5 flex items-center gap-3 font-mono text-xs">
                <span className="border border-line px-3 py-2">SAP S/4HANA</span>
                <span className="bento-link relative h-px flex-1 bg-line" />
                <span className="border border-line px-3 py-2">SCALE WMS</span>
              </div>
              <p className="text-xl font-semibold">Warehouse platform, wired both ways.</p>
              <p className="mt-2 text-mute">Real-time Socket.IO dashboards for live operations.</p>
            </div>
          </article>

          <article className="bento-tile flex flex-col justify-between md:col-span-4">
            <p className={label}>team</p>
            <div>
              <p className={big}>3–5</p>
              <p className="mt-4 text-mute">Engineers I lead, with the code review workflow and standards I set.</p>
            </div>
          </article>

          <article className="bento-tile flex flex-col justify-between md:col-span-4">
            <p className={label}>shipped solo</p>
            <div>
              <p className="display text-[clamp(2.4rem,5vw,4rem)]">Teeme</p>
              <p className="mt-4 text-mute">A project management SaaS I designed, built and launched on my own, with an AI assistant that acts within a user’s role.</p>
            </div>
          </article>

          <article className="bento-tile flex flex-col justify-between md:col-span-4">
            <p className={label}>daily tools</p>
            <ul className="flex flex-wrap gap-2 font-mono text-xs">
              {stack.map((s) => (
                <li key={s} className="border border-line px-3 py-1.5 transition-colors hover:border-signal-soft hover:text-signal-soft">{s}</li>
              ))}
            </ul>
          </article>
        </div>
      </div>
    </section>
  );
}
