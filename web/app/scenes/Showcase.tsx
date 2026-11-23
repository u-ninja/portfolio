'use client';
import { useEffect, useRef, useState, type ComponentType } from 'react';
import Link from 'next/link';
import type { Project } from '../data/projects';
import { TeemeDemo } from './demos/TeemeDemo';
import { ErpDemo } from './demos/ErpDemo';
import { QlueDemo } from './demos/QlueDemo';
import { NinjaDemo } from './demos/NinjaDemo';
import { BlacksiteDemo } from './demos/BlacksiteDemo';

const demos: Record<string, ComponentType<{ stage: number }>> = {
  teeme: TeemeDemo, erp: ErpDemo, qlueprint: QlueDemo, ninjatrade: NinjaDemo, blacksite: BlacksiteDemo,
};

export function Showcase({ project, bare }: { project: Project; bare?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const steps = ref.current?.querySelectorAll('[data-step]');
    if (!steps) return;
    // the step crossing mid-viewport sets the demo's stage, in either scroll direction
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setStage(Number((e.target as HTMLElement).dataset.step));
      },
      // on small screens the demo is pinned over the top half, so the trigger line sits lower
      { rootMargin: window.matchMedia('(min-width: 1024px)').matches ? '-50% 0px -50% 0px' : '-80% 0px -20% 0px' },
    );
    steps.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  const Demo = demos[project.slug];
  return (
    <article className={bare ? '' : 'border-t border-line pt-14 md:pt-20'}>
      {!bare && (
      <header className="mb-8 grid gap-6 md:mb-4 md:grid-cols-[1.4fr_1fr] md:items-end">
        <div>
          <h3 className="display mb-4 text-[clamp(2.4rem,6vw,5rem)]">
            <Link href={`/work/${project.slug}`} className="hover:text-signal-soft">{project.title}</Link>
          </h3>
          <p className="max-w-xl text-lg leading-relaxed text-mute">{project.tagline}</p>
        </div>
        <div className="font-mono text-xs leading-6 text-mute md:text-right">
          <p className="text-paper">{project.role}, {project.year}</p>
          <p>{project.tech.join(' / ')}</p>
          <p className="mt-2 flex flex-wrap gap-4 md:justify-end">
            {project.links.map((l) => (
              <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="text-signal-soft underline underline-offset-4 hover:text-paper">
                {l.label}
              </a>
            ))}
            <Link href={`/work/${project.slug}`} className="text-paper underline underline-offset-4 hover:text-signal-soft">Case study →</Link>
          </p>
        </div>
      </header>
      )}

      <div ref={ref} className="lg:grid lg:grid-cols-2 lg:gap-16">
        <div className="sticky top-[68px] z-10 -mx-6 h-[54svh] min-h-[390px] bg-ink px-6 py-3 md:-mx-10 md:px-10 lg:order-2 lg:top-[14vh] lg:mx-0 lg:h-[72vh] lg:max-h-[560px] lg:bg-transparent lg:p-0">
          <Demo stage={stage} />
        </div>
        <ol>
          {project.steps.map((s, i) => (
            <li
              key={s.h}
              data-step={i}
              className={`flex min-h-[52vh] flex-col justify-center transition-opacity duration-500 lg:min-h-[72vh] ${stage === i ? 'opacity-100' : 'opacity-35'}`}
            >
              <p className="mb-3 font-mono text-xs text-signal-soft">
                {i + 1} / {project.steps.length}
              </p>
              <h4 className="mb-3 text-2xl font-semibold md:mb-4 md:text-4xl">{s.h}</h4>
              <p className="max-w-md leading-relaxed text-mute md:text-lg">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </article>
  );
}

