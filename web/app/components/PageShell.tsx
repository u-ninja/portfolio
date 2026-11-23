import Link from 'next/link';
import { Nav } from './Nav';
import { ParticleField } from '../scenes/ParticleField';

/** Common frame for the inner pages: background field, nav and a breadcrumb trail. */
export function PageShell({ crumbs, children }: { crumbs: { label: string; href?: string }[]; children: React.ReactNode }) {
  return (
    <>
      <ParticleField />
      <Nav />
      <main className="relative z-10">
        <nav aria-label="Breadcrumb" className="mx-auto max-w-6xl px-6 pt-28 font-mono text-xs text-mute md:px-10 md:pt-32">
          <ol className="flex flex-wrap gap-2">
            {[{ label: 'Home', href: '/' }, ...crumbs].map((c, i, all) => (
              <li key={c.label} className="flex gap-2">
                {c.href && i < all.length - 1 ? <Link href={c.href} className="hover:text-paper">{c.label}</Link> : <span className="text-paper">{c.label}</span>}
                {i < all.length - 1 && <span aria-hidden="true">/</span>}
              </li>
            ))}
          </ol>
        </nav>
        {children}
      </main>
    </>
  );
}
