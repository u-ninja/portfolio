import Link from 'next/link';

const links = [
  { label: 'Email me', href: 'mailto:hello@teeme.org' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/ullas-js-7694391b2/' },
  { label: 'GitHub', href: 'https://github.com/UllasJs/' },
];

export function Invitation() {
  return (
    <section
      id="contact"
      data-shape="knot"
      data-alpha="0.9"
      data-x="0.5"
      data-scale="0.85"
      className="relative flex min-h-svh flex-col justify-between px-6 pt-32 md:px-10"
    >
      <div className="mx-auto w-full max-w-6xl">
        <p className="mb-6 font-mono text-sm text-signal-soft">return contact;</p>
        <h2 className="display text-[clamp(2.8rem,9.5vw,9rem)]">
          Have a challenging problem?
          <span className="mt-[0.25em] block text-mute">Let’s build something remarkable.</span>
        </h2>

        <div className="mt-12 flex flex-wrap gap-3">
          <Link href="/start-project" className="btn btn-solid">Start a project</Link>
          <a href="/Ullas_JS_Resume.pdf" download className="btn">Download résumé</a>
        </div>

        <ul className="mt-12 flex flex-col gap-3 text-xl md:flex-row md:gap-10">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                {...(l.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="underline decoration-line underline-offset-8 transition-colors hover:decoration-signal-soft"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-6 max-w-md text-mute">
          Based in Kochi, India. Open to remote roles and to relocating to the UAE, Australia or Germany.
        </p>
      </div>

      <footer className="mx-auto mt-24 flex w-full max-w-6xl flex-col justify-between gap-2 border-t border-line py-6 font-mono text-xs text-mute md:flex-row">
        <span>© {new Date().getFullYear()} Ullas JS</span>
        <span>process exited with code 0</span>
      </footer>
    </section>
  );
}
