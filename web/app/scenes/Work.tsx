import Link from 'next/link';
import { projects } from '../data/projects';

export function Work() {
  return (
    <section id="work" className="relative px-6 py-24 md:px-10 md:py-36">
      <div className="mx-auto max-w-6xl">
        <p className="mb-10 font-mono text-xs text-mute">Selected work</p>
        <ul className="border-t border-line">
          {projects.map((p, i) => (
            <li key={p.slug} className="reveal border-b border-line">
              <Link href={`/work/${p.slug}`} className="fill-row group grid gap-x-8 gap-y-2 px-1 py-7 md:grid-cols-[3rem_1fr_1.1fr_4rem] md:items-baseline md:py-9">
                <span className="font-mono text-xs text-mute">0{i + 1}</span>
                <span className="display text-[clamp(2rem,4.6vw,4rem)] transition-transform duration-500 [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)] group-hover:translate-x-3">{p.title}</span>
                <span className="text-mute">{p.tagline}</span>
                <span className="font-mono text-xs text-mute md:text-right">{p.year}</span>
              </Link>
            </li>
          ))}
        </ul>
        <Link href="/work" className="mt-8 inline-block font-mono text-sm text-signal-soft underline underline-offset-4 hover:text-paper">All projects →</Link>
      </div>
    </section>
  );
}
