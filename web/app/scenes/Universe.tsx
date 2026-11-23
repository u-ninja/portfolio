'use client';
import Link from 'next/link';
import { useCallback, useRef, useState } from 'react';
import { useScrollProgress } from '../lib/scroll';
import { SceneHead } from './SceneHead';

import { nodes, edges, type Id } from '../data/skills';

// A real breadth-first search over the graph above; scrolling steps through its trace.
function bfs(start: Id) {
  const trace: { visit: Id; queue: Id[]; visited: Id[]; via: number }[] = [];
  const seen = new Set<Id>([start]);
  const queue: { id: Id; via: number }[] = [{ id: start, via: -1 }];
  const visited: Id[] = [];
  while (queue.length) {
    const { id, via } = queue.shift()!;
    visited.push(id);
    edges.forEach(([a, b], i) => {
      const next = a === id ? b : b === id ? a : null;
      if (next && !seen.has(next)) {
        seen.add(next);
        queue.push({ id: next, via: i });
      }
    });
    trace.push({ visit: id, queue: queue.map((q) => q.id), visited: [...visited], via });
  }
  return trace;
}
const trace = bfs('frontend');

export function Universe() {
  const ref = useRef<HTMLElement>(null);
  const [step, setStep] = useState(0);
  const [pick, setPick] = useState<{ step: number; id: Id } | null>(null);
  const onScroll = useCallback((p: number) => setStep(Math.min(trace.length - 1, Math.round(p * (trace.length - 1)))), []);
  useScrollProgress(ref, onScroll);

  const now = trace[step];
  const shown = pick?.step === step ? pick.id : now.visit; // a click holds until the traversal moves on
  const node = nodes[shown];
  const treeEdges = new Set(trace.slice(0, step + 1).map((t) => t.via));

  return (
    <section
      id="skills"
      ref={ref}
      data-shape="wave"
      data-alpha="0.45"
      data-stops={trace.map((_, k) => k / (trace.length - 1)).join(',')}
      className="relative"
      style={{ height: `${(trace.length - 1) * 90 + 100}vh` }}
    >
      <div className="sticky top-0 flex min-h-svh flex-col justify-center px-6 pb-8 pt-24 md:px-10">
        <div className="mx-auto w-full max-w-6xl">
          <div className="hidden md:block">
            <SceneHead fn="bfs(skills, 'frontend')" title="How the parts connect" />
          </div>
          <h2 className="display text-4xl md:hidden">How the parts connect</h2>

          <div className="mt-6 grid items-center gap-6 md:mt-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
            <div className="relative mx-auto aspect-[600/480] w-full max-w-[min(100%,calc(36svh*1.25))] lg:max-w-none">
              <svg viewBox="0 0 600 480" className="absolute inset-0 h-full w-full" aria-hidden="true">
                {edges.map(([a, b], i) => (
                  <line
                    key={i}
                    x1={nodes[a].x} y1={nodes[a].y} x2={nodes[b].x} y2={nodes[b].y}
                    className="transition-[stroke] duration-500"
                    stroke={treeEdges.has(i) ? 'var(--color-signal)' : 'rgb(255 255 255 / 0.3)'}
                    strokeWidth={treeEdges.has(i) ? 2 : 1}
                    strokeDasharray={treeEdges.has(i) ? undefined : '4 6'}
                  />
                ))}
              </svg>
              {(Object.keys(nodes) as Id[]).map((id) => {
                const visited = now.visited.includes(id);
                return (
                  <button
                    key={id}
                    type="button"
                    aria-pressed={shown === id}
                    onClick={() => setPick({ step, id })}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer whitespace-nowrap border px-2.5 py-1.5 font-mono text-[11px] transition-colors duration-300 md:px-3 md:py-2 md:text-xs ${
                      shown === id
                        ? 'border-signal bg-signal text-white'
                        : visited
                          ? 'border-signal bg-panel text-paper'
                          : 'border-line bg-panel text-mute hover:border-paper hover:text-paper'
                    }`}
                    style={{ left: `${(nodes[id].x / 600) * 100}%`, top: `${(nodes[id].y / 480) * 100}%` }}
                  >
                    {nodes[id].label}
                  </button>
                );
              })}
            </div>

            <div>
              <pre aria-hidden="true" className="mb-5 hidden overflow-hidden border-l border-signal pl-4 font-mono text-xs leading-6 text-mute md:block">
                {`visit    `}<span className="text-paper">{now.visit}</span>
                {`\nqueue    [${now.queue.join(', ')}]\nvisited  ${now.visited.length} of ${trace.length}`}
              </pre>
              <div aria-live="polite" className="min-h-[15.5rem] md:min-h-[17rem]">
                <h3 className="mb-2 text-2xl font-semibold md:text-3xl">{node.label}</h3>
                <p className="mb-4 leading-relaxed text-mute">{node.what}</p>
                <p className="mb-4 font-mono text-xs leading-6 text-signal-soft">{node.tech.join('  /  ')}</p>
                <p className="mb-3 border-t border-line pt-4 text-sm leading-relaxed">
                  <span className="text-mute">Hard part solved: </span>
                  {node.hard}
                </p>
                <p className="text-sm text-mute">Seen in: {node.projects.join(', ')}</p>
                <Link href={`/skills/${shown}`} className="mt-3 inline-block font-mono text-xs text-signal-soft underline underline-offset-4 hover:text-paper">Open the {node.label} page →</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
