import type { Metadata } from 'next';
import Link from 'next/link';
import { PageShell } from '../components/PageShell';
import { Swap } from '../components/Swap';
import { nodes, type Id } from '../data/skills';

export const metadata: Metadata = {
  title: 'Skills — Ullas JS',
  description: 'Frontend, backend, real-time, data, cloud and AI work, each with the hard problem it solved.',
};

export default function Skills() {
  return (
    <PageShell crumbs={[{ label: 'Skills' }]}>
      <section data-shape="lattice" data-alpha="0.3" className="px-6 pb-24 pt-10 md:px-10 md:pb-36">
        <div className="mx-auto max-w-6xl">
          <h1 className="display mb-16 text-[clamp(3.5rem,13vw,11rem)]">Skills</h1>
          <div className="grid gap-4 md:grid-cols-2">
            {(Object.keys(nodes) as Id[]).map((id, i) => (
              <Link key={id} href={`/skills/${id}`} className="bento-tile reveal flex min-h-60 flex-col justify-between">
                <span className="font-mono text-xs text-mute">{String(i + 1).padStart(2, '0')}</span>
                <span>
                  <span className="display block text-[clamp(1.8rem,3.6vw,3rem)]"><Swap>{nodes[id].label}</Swap></span>
                  <span className="mt-3 block max-w-md text-mute">{nodes[id].what}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
