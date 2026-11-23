import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PageShell } from '../../components/PageShell';
import { Swap } from '../../components/Swap';
import { projects } from '../../data/projects';
import { edges, nodes, type Id } from '../../data/skills';

const ids = Object.keys(nodes) as Id[];

export function generateStaticParams() {
  return ids.map((id) => ({ id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const n = nodes[(await params).id as Id];
  return n ? { title: `${n.label} — Ullas JS`, description: n.what } : {};
}

export default async function Skill({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id as Id;
  if (!nodes[id]) notFound();
  const n = nodes[id];
  const next = ids[(ids.indexOf(id) + 1) % ids.length];
  const linked = projects.filter((p) => n.projects.some((name) => p.title.startsWith(name)));
  const noPage = n.projects.filter((name) => !projects.some((p) => p.title.startsWith(name)));
  const related = edges.flatMap(([a, b]) => (a === id ? [b] : b === id ? [a] : []));

  return (
    <PageShell crumbs={[{ label: 'Skills', href: '/skills' }, { label: n.label }]}>
      <section data-shape="lattice" data-alpha="0.35" data-x="0.6" data-scale="0.7" className="px-6 pb-16 pt-10 md:px-10 md:pb-24">
        <div className="mx-auto max-w-6xl">
          <h1 className="display mb-8 text-[clamp(3rem,11vw,9.5rem)]">{n.label}</h1>
          <p className="max-w-2xl text-xl leading-relaxed text-mute md:text-2xl">{n.what}</p>
        </div>
      </section>

      <section data-shape="dust" data-alpha="0.18" className="px-6 pb-24 md:px-10 md:pb-32">
        <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-12">
          <div className="bento-tile reveal md:col-span-7">
            <p className="mb-5 font-mono text-xs text-mute">hard part solved</p>
            <p className="text-2xl leading-snug md:text-3xl">{n.hard}</p>
          </div>
          <div className="bento-tile reveal md:col-span-5">
            <p className="mb-5 font-mono text-xs text-mute">tools</p>
            <ul className="flex flex-wrap gap-2 font-mono text-xs">
              {n.tech.map((t) => <li key={t} className="rounded-full border border-line px-3 py-1.5">{t}</li>)}
            </ul>
          </div>
          <div className="bento-tile reveal md:col-span-7">
            <p className="mb-5 font-mono text-xs text-mute">seen in</p>
            <ul>
              {linked.map((p) => (
                <li key={p.slug} className="border-t border-line first:border-t-0">
                  <Link href={`/work/${p.slug}`} className="display block py-4 text-[clamp(1.6rem,3vw,2.4rem)]"><Swap>{p.title}</Swap></Link>
                </li>
              ))}
              {noPage.map((name) => <li key={name} className="border-t border-line py-4 text-mute">{name} <span className="font-mono text-xs">(client work, no public page)</span></li>)}
            </ul>
          </div>
          <div className="bento-tile reveal md:col-span-5">
            <p className="mb-5 font-mono text-xs text-mute">connects to</p>
            <ul className="flex flex-wrap gap-2">
              {related.map((r) => (
                <li key={r}><Link href={`/skills/${r}`} className="inline-block rounded-full border border-line px-4 py-2 transition-colors hover:border-signal-soft hover:text-signal-soft">{nodes[r].label} →</Link></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mx-auto mt-20 max-w-6xl">
          <Link href={`/skills/${next}`} className="reveal block border-t border-line pt-10">
            <span className="font-mono text-xs text-mute">next skill</span>
            <span className="display mt-3 block text-[clamp(2.5rem,8vw,7rem)]"><Swap>{nodes[next].label}</Swap></span>
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
