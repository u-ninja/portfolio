'use client';
import { useRef, useState } from 'react';
import { useScrollProgress } from '../lib/scroll';
import { SceneHead } from './SceneHead';

type Node = { id: string; label: string; does: string; tech: string; why: string };

// Only what my work on this platform supports. Client specifics are left out.
const layers: { name: string; nodes: Node[] }[] = [
  {
    name: 'Screens',
    nodes: [{
      id: 'ui', label: 'Live operations dashboards',
      does: 'The screens the warehouse floor works from all day.',
      tech: 'Next.js, TypeScript, Socket.IO client',
      why: 'Screens update from pushed events instead of asking again and again, so the floor sees a change the moment it happens.',
    }],
  },
  {
    name: 'Front door',
    nodes: [{
      id: 'apim', label: 'Azure API Management',
      does: 'One entry point in front of every service.',
      tech: 'Azure API Management, HTTPS',
      why: 'Clients know one address. Services behind it can be split, moved or redeployed without the screens noticing.',
    }],
  },
  {
    name: 'Services',
    nodes: [
      {
        id: 'svc', label: '7 Node.js services',
        does: 'The business rules of the warehouse, split across seven services.',
        tech: 'Node.js, TypeScript, Azure Container Apps',
        why: 'Every deploy is a new revision. A bad release is undone by sending traffic back to the previous one, which is how about 29 releases a week stay safe.',
      },
      {
        id: 'rt', label: 'Socket.IO live updates',
        does: 'Pushes what happens on the floor to every open dashboard.',
        tech: 'Socket.IO',
        why: 'Designed for high concurrency: many people watching and changing the same live data at once.',
      },
    ],
  },
  {
    name: 'Data',
    nodes: [
      {
        id: 'sql', label: 'Azure SQL',
        does: 'The system of record.',
        tech: 'Azure SQL',
        why: 'Rewriting nested legacy queries and redesigning batch processing raised data-entry throughput by 40%.',
      },
      {
        id: 'ledger', label: 'Ledger pipeline',
        does: 'Posts cashflow automatically.',
        tech: 'Database transactions, audit trail',
        why: 'Transaction-safe: a posting completes fully or not at all, and every step leaves a record in a complete audit trail.',
      },
    ],
  },
  {
    name: 'Outside systems',
    nodes: [
      {
        id: 'sap', label: 'SAP S/4HANA',
        does: 'The client’s ERP, integrated with the warehouse platform.',
        tech: 'SAP S/4HANA integration',
        why: 'Warehouse work and the business’s books have to agree, so the platform is built around that integration rather than bolted onto it.',
      },
      {
        id: 'wms', label: 'SCALE WMS',
        does: 'A second warehouse’s management system.',
        tech: 'Two-way sync',
        why: 'Customers, carriers, buildings and appointments sync in both directions, with access scoped per facility.',
      },
    ],
  },
];
const all = layers.flatMap((l) => l.nodes);

export function Architecture() {
  const ref = useRef<HTMLElement>(null);
  const [open, setOpen] = useState('svc');
  useScrollProgress(ref);
  const node = all.find((n) => n.id === open)!;

  return (
    <section id="systems" ref={ref} data-shape="layers" data-alpha="0.3" data-x="0.4" data-scale="0.85" data-stops="0,0.25,0.5,0.75,1" className="arch relative lg:h-[300vh]">
      <div className="flex flex-col justify-center px-6 py-24 md:px-10 lg:sticky lg:top-0 lg:h-svh lg:py-20">
        <div className="mx-auto grid w-full max-w-6xl gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
          <div className="flex flex-col justify-between gap-8">
            <SceneHead fn="explain(system)" title="Under the hood">
              The warehouse platform I lead at Digitrell, simplified. Scroll to assemble it, then open any part.
            </SceneHead>
            <div aria-live="polite" className="border-l border-signal pl-5">
              <h3 className="mb-3 text-2xl font-semibold">{node.label}</h3>
              <dl className="space-y-3 text-sm leading-relaxed">
                <div><dt className="font-mono text-xs text-signal-soft">What it does</dt><dd>{node.does}</dd></div>
                <div><dt className="font-mono text-xs text-signal-soft">Built with</dt><dd>{node.tech}</dd></div>
                <div><dt className="font-mono text-xs text-signal-soft">Why it is built this way</dt><dd className="text-mute">{node.why}</dd></div>
              </dl>
            </div>
          </div>

          <ol className="flex flex-col">
            {layers.map((layer, i) => (
              <li key={layer.name} className="node-in" style={{ '--on': `clamp(0, calc(var(--p, 1) * ${layers.length + 1} - ${i}), 1)` } as React.CSSProperties}>
                {i > 0 && (
                  <div aria-hidden="true" className="relative mx-auto h-7 w-px bg-signal lg:h-9">
                    <span className="packet absolute -left-[3px] top-0 h-[7px] w-[7px] bg-signal-soft" style={{ animationDelay: `${i * 0.35}s` }} />
                  </div>
                )}
                <div className="grid grid-cols-[5.5rem_1fr] items-center gap-3 md:grid-cols-[8rem_1fr]">
                  <span className="font-mono text-[11px] text-mute md:text-xs">{layer.name}</span>
                  <div className="flex gap-2">
                    {layer.nodes.map((n) => (
                      <button
                        key={n.id}
                        type="button"
                        aria-pressed={open === n.id}
                        onClick={() => setOpen(n.id)}
                        className={`flex-1 cursor-pointer border px-3 py-3 text-left font-mono text-xs transition-colors duration-200 md:px-4 ${
                          open === n.id ? 'border-signal bg-signal text-white' : 'border-line bg-panel text-paper hover:border-paper'
                        }`}
                      >
                        {n.label}
                      </button>
                    ))}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
