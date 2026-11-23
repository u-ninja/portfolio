'use client';
import { useCallback, useRef, useState } from 'react';
import { useScrollProgress } from '../lib/scroll';
import { SceneHead } from './SceneHead';

type Id = 'frontend' | 'backend' | 'realtime' | 'data' | 'cloud' | 'ai';

const nodes: Record<Id, { label: string; x: number; y: number; what: string; tech: string[]; hard: string; projects: string[] }> = {
  frontend: {
    label: 'Frontend', x: 90, y: 240,
    what: 'Interfaces people work in all day: boards, dashboards and admin tools that stay fast while the data underneath keeps changing.',
    tech: ['React', 'Next.js', 'TypeScript', 'Vue.js', 'Nuxt.js', 'TanStack', 'Pinia', 'Tailwind CSS'],
    hard: 'Cut initial page load by 30% by moving key pages to server-side and static rendering.',
    projects: ['Teeme', 'Config-driven ERP'],
  },
  backend: {
    label: 'Backend', x: 300, y: 240,
    what: 'APIs and services with validated input, role checks and transactions that hold up under concurrent use.',
    tech: ['Node.js', 'Express', 'Bun', 'REST', 'Zod', 'JWT'],
    hard: 'A transaction-safe ledger pipeline that posts cashflow automatically and keeps a complete audit trail.',
    projects: ['Teeme', 'Warehouse platform'],
  },
  realtime: {
    label: 'Real-time & integrations', x: 215, y: 70,
    what: 'Keeping separate systems in agreement while operations are live on the warehouse floor.',
    tech: ['Socket.IO', 'SAP S/4HANA', 'SCALE WMS'],
    hard: 'Two-way sync of customers, carriers, buildings and appointments with a second warehouse’s WMS, with per-facility access.',
    projects: ['Warehouse platform'],
  },
  data: {
    label: 'Databases', x: 300, y: 410,
    what: 'Schemas, queries and permission models that stay correct as the product grows.',
    tech: ['PostgreSQL', 'Azure SQL', 'MySQL', 'MongoDB', 'Prisma', 'TypeORM'],
    hard: '40% more data-entry throughput from rewriting nested legacy queries and redesigning batch processing.',
    projects: ['QluePrint', 'Teeme'],
  },
  cloud: {
    label: 'Cloud & delivery', x: 505, y: 335,
    what: 'Shipping many times a week without breaking production.',
    tech: ['Azure Container Apps', 'API Management', 'Azure DevOps CI/CD', 'Vercel'],
    hard: 'About 29 releases a week kept stable with hotfix branches and revision-based deploys.',
    projects: ['Warehouse platform'],
  },
  ai: {
    label: 'AI integration', x: 500, y: 110,
    what: 'AI as a product feature, and as the way I work: fast, but owning every line that ships.',
    tech: ['Claude API', 'LLM agents', 'Cursor'],
    hard: 'An assistant that turns plain-language or voice commands into board actions, asks for approval and only acts within the user’s role.',
    projects: ['Teeme'],
  },
};

const edges: [Id, Id][] = [
  ['frontend', 'backend'], ['frontend', 'realtime'], ['backend', 'realtime'], ['backend', 'data'],
  ['backend', 'cloud'], ['backend', 'ai'], ['data', 'cloud'],
];

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
  const onScroll = useCallback((p: number) => setStep(Math.min(trace.length - 1, Math.floor(p * trace.length))), []);
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
      data-stops={[0, ...trace.map((_, k) => (k === trace.length - 1 ? 1 : (k + 0.5) / trace.length))].join(',')}
      className="relative"
      style={{ height: `${trace.length * 55 + 100}vh` }}
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
