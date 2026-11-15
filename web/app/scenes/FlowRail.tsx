'use client';
import { useEffect, useState } from 'react';

// The page is one program; the rail is its flowchart and its navigation.
const steps = [
  { id: 'top', fn: 'start', shape: 'pill' },
  { id: 'story', fn: 'narrate()', shape: 'rect' },
  { id: 'skills', fn: 'traverse(skills)', shape: 'rect' },
  { id: 'work', fn: 'ship(projects)', shape: 'rect' },
  { id: 'systems', fn: 'explain(system)', shape: 'rect' },
  { id: 'experience', fn: 'git log', shape: 'rect' },
  { id: 'play', fn: 'curious?', shape: 'diamond' },
  { id: 'contact', fn: 'return contact', shape: 'pill' },
] as const;

export function FlowRail() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    // a zero-height band at mid-viewport: whichever section crosses it is the current step
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(steps.findIndex((s) => s.id === e.target.id));
        }
      },
      { rootMargin: '-50% 0px -50% 0px' },
    );
    steps.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  return (
    <nav aria-label="Page sections" className="fixed right-5 top-1/2 z-30 hidden -translate-y-1/2 lg:block">
      <ol className="relative flex flex-col gap-5">
        <span aria-hidden="true" className="absolute bottom-2 right-[6.5px] top-2 w-px bg-line" />
        <span
          aria-hidden="true"
          className="absolute right-[6.5px] top-2 w-px bg-signal transition-[height] duration-500"
          style={{ height: `calc((100% - 1rem) * ${active / (steps.length - 1)})` }}
        />
        {steps.map((s, i) => (
          <li key={s.id} className="relative flex justify-end">
            <a
              href={`#${s.id}`}
              aria-current={i === active ? 'step' : undefined}
              className="group flex items-center gap-3 font-mono text-xs"
            >
              <span
                className={`transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 ${
                  i === active ? 'text-paper opacity-100' : 'text-mute opacity-0'
                }`}
              >
                {s.fn}
              </span>
              <span
                aria-hidden="true"
                className={`block h-3.5 w-3.5 border transition-colors duration-300 ${
                  s.shape === 'pill' ? 'rounded-full' : s.shape === 'diamond' ? 'rotate-45' : ''
                } ${i <= active ? 'border-signal bg-signal' : 'border-mute bg-ink'}`}
              />
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
