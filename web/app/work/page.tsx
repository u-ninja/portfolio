import type { Metadata } from 'next';
import Link from 'next/link';
import { PageShell } from '../components/PageShell';
import { Swap } from '../components/Swap';
import { projects } from '../data/projects';

export const metadata: Metadata = {
  title: 'Work — Ullas JS',
  description: 'Selected projects: Teeme, a config-driven ERP, QluePrint, NinjaTrade and Blacksite.',
};

export default function Work() {
  return (
    <PageShell crumbs={[{ label: 'Work' }]}>
      <section data-shape="dust" data-alpha="0.25" className="px-6 pb-24 pt-10 md:px-10 md:pb-36">
        <div className="mx-auto max-w-6xl">
          <h1 className="display mb-16 text-[clamp(3.5rem,13vw,11rem)]">Selected work</h1>
          <ul>
            {projects.map((p, i) => (
              <li key={p.slug} className="reveal border-t border-line last:border-b">
                <Link href={`/work/${p.slug}`} data-cursor="hide" className="fill-row -mx-4 grid items-end gap-4 px-4 py-8 md:-mx-6 md:grid-cols-[4rem_1.6fr_1fr_auto] md:px-6 md:py-10">
                  <span className="font-mono text-xs text-mute">{String(i + 1).padStart(2, '0')}</span>
                  <span className="display text-[clamp(2rem,5vw,4.2rem)]"><Swap>{p.title}</Swap></span>
                  <span className="max-w-sm text-mute">{p.tagline}</span>
                  <span className="font-mono text-xs text-signal-soft md:text-right">{p.role}, {p.year}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </PageShell>
  );
}
