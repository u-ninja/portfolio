import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PageShell } from '../../components/PageShell';
import { Swap } from '../../components/Swap';
import { Showcase } from '../../scenes/Showcase';
import { projects } from '../../data/projects';
import { nodes, type Id } from '../../data/skills';

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = projects.find((x) => x.slug === slug);
  return p ? { title: `${p.title} — Ullas JS`, description: p.tagline } : {};
}

export default async function Project({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const i = projects.findIndex((x) => x.slug === slug);
  if (i < 0) notFound();
  const p = projects[i];
  const next = projects[(i + 1) % projects.length];
  // A skill is linked when it lists this project by (the start of) its title.
  const skills = (Object.keys(nodes) as Id[]).filter((id) => nodes[id].projects.some((n) => p.title.startsWith(n)));

  return (
    <PageShell crumbs={[{ label: 'Work', href: '/work' }, { label: p.title }]}>
      <section data-shape="knot" data-alpha="0.4" data-x="0.6" data-scale="0.7" className="px-6 pb-16 pt-10 md:px-10 md:pb-24">
        <div className="mx-auto max-w-6xl">
          <h1 className="display mb-8 text-[clamp(3rem,11vw,9.5rem)]">{p.title}</h1>
          <div className="grid gap-10 md:grid-cols-[1.4fr_1fr]">
            <p className="max-w-xl text-xl leading-relaxed text-mute md:text-2xl">{p.tagline}</p>
            <dl className="grid gap-5 font-mono text-xs leading-6">
              <div><dt className="text-mute">role</dt><dd>{p.role}, {p.year}</dd></div>
              <div><dt className="text-mute">built with</dt><dd className="flex flex-wrap gap-2 pt-1">{p.tech.map((t) => <span key={t} className="rounded-full border border-line px-3 py-1">{t}</span>)}</dd></div>
              {p.links.length > 0 && (
                <div><dt className="text-mute">links</dt><dd className="flex flex-wrap gap-4">{p.links.map((l) => <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="text-signal-soft underline underline-offset-4 hover:text-paper">{l.label} ↗</a>)}</dd></div>
              )}
            </dl>
          </div>
        </div>
      </section>

      <section data-shape="dust" data-alpha="0.18" className="px-6 md:px-10">
        <div className="mx-auto max-w-6xl border-t border-line pt-10 md:pt-14">
          <Showcase project={p} bare />
        </div>
      </section>

      <section data-shape="dust" data-alpha="0.15" className="px-6 py-20 md:px-10 md:py-32">
        <div className="mx-auto max-w-6xl">
          {skills.length > 0 && (
            <div className="reveal mb-20">
              <h2 className="mb-5 font-mono text-xs text-signal-soft">skills used</h2>
              <div className="flex flex-wrap gap-3">
                {skills.map((id) => (
                  <Link key={id} href={`/skills/${id}`} className="rounded-full border border-line px-5 py-2.5 transition-colors hover:border-signal-soft hover:text-signal-soft">{nodes[id].label} →</Link>
                ))}
              </div>
            </div>
          )}
          <Link href={`/work/${next.slug}`} className="reveal group block border-t border-line pt-10">
            <span className="font-mono text-xs text-mute">next project</span>
            <span className="display mt-3 block text-[clamp(2.5rem,8vw,7rem)]"><Swap>{next.title}</Swap></span>
          </Link>
          <p className="mt-12 text-mute">
            Want something like this? <Link href="/start-project" className="text-paper underline decoration-line underline-offset-4 hover:decoration-signal-soft">Start a project</Link>.
          </p>
        </div>
      </section>
    </PageShell>
  );
}
