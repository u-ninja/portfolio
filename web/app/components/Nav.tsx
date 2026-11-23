'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { WHATSAPP_URL, WhatsAppIcon } from './WhatsApp';

const links = [
  { label: 'Skills', href: '/skills', fn: 'traverse(skills)' },
  { label: 'Work', href: '/work', fn: 'ship(projects)' },
  { label: 'Systems', href: '/#systems', fn: 'explain(system)' },
  { label: 'Experience', href: '/#experience', fn: 'git log' },
  { label: 'Contact', href: '/#contact', fn: 'return contact' },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Escape key + body scroll lock
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && menuOpen) closeMenu();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  // Focus first link when drawer opens
  useEffect(() => {
    if (menuOpen) {
      const first = drawerRef.current?.querySelector<HTMLElement>('a, button');
      first?.focus();
    }
  }, [menuOpen]);

  function closeMenu() {
    setMenuOpen(false);
    toggleRef.current?.focus();
  }

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          background: menuOpen ? 'var(--color-ink)' : scrolled ? 'rgba(5,6,10,0.88)' : 'transparent',
          backdropFilter: scrolled || menuOpen ? 'blur(16px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
        }}
      >
        <nav className="max-w-6xl mx-auto px-6 md:px-10 h-[68px] flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            aria-label="Ullas JS, home"
            className="flex items-center gap-2.5 text-white font-bold text-xl tracking-tight hover:opacity-70 transition-opacity duration-200"
          >
            {/* the mark: a "U" drawn as a flowchart connector, same as app/icon.svg */}
            <svg width="26" height="26" viewBox="0 0 64 64" aria-hidden="true">
              <path d="M20 16v20a12 12 0 0 0 24 0V18" fill="none" stroke="currentColor" strokeWidth="7" />
              <rect x="13" y="8" width="14" height="14" fill="#2f6bff" />
              <circle cx="44" cy="15" r="7.5" fill="#2f6bff" />
            </svg>
            ullas
          </Link>

          {/* Desktop nav links */}
          <ul className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-sm text-mute hover:text-white transition-colors duration-200 tracking-wide cursor-pointer"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Desktop CTA */}
          <a
            href="/start-project"
            className="hidden md:inline-flex text-sm px-4 py-2 border border-[rgba(255,255,255,0.15)] text-[#ccc] hover:bg-white hover:text-black hover:border-white font-mono transition-all duration-200 cursor-pointer"
          >
            Get in touch
          </a>

          {/* Mobile hamburger — 44×44px minimum touch target */}
          <button
            ref={toggleRef}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav-drawer"
            onClick={() => setMenuOpen((v) => !v)}
            className="md:hidden flex flex-col justify-center items-center w-11 h-11 gap-[5px] cursor-pointer"
          >
            <span
              className="block h-px w-6 bg-white transition-all duration-300 origin-center"
              style={menuOpen ? { transform: 'translateY(6px) rotate(45deg)' } : {}}
            />
            <span
              className="block h-px bg-white transition-all duration-300"
              style={menuOpen ? { width: '0px', opacity: 0 } : { width: '24px' }}
            />
            <span
              className="block h-px w-6 bg-white transition-all duration-300 origin-center"
              style={menuOpen ? { transform: 'translateY(-6px) rotate(-45deg)' } : {}}
            />
          </button>
        </nav>
      </header>

      {/* Full-screen sheet. It sits under the header, so the logo and the close button stay in place. */}
      <div
        id="mobile-nav-drawer"
        ref={drawerRef}
        role="dialog"
        aria-label="Navigation menu"
        aria-modal="true"
        inert={!menuOpen}
        className={`mobile-nav-sheet md:hidden ${menuOpen ? 'open' : ''}`}
      >
        <div className="flex min-h-full flex-col px-6 pb-8 pt-28">
          <nav aria-label="Mobile navigation">
            {/* the links hang off one line, like steps in a flowchart */}
            <ul className="border-l border-line">
              {links.map((link, i) => (
                <li key={link.href} className="relative overflow-hidden pl-6">
                  <span aria-hidden="true" className="absolute -left-[5px] top-1/2 h-[9px] w-[9px] -translate-y-1/2 border border-signal bg-ink" />
                  <a
                    href={link.href}
                    onClick={closeMenu}
                    className="rise flex items-baseline justify-between gap-4 py-2.5"
                    style={{ '--i': i } as React.CSSProperties}
                  >
                    <span className="display text-[clamp(2.75rem,13vw,4rem)]">{link.label}</span>
                    <span className="font-mono text-xs text-signal-soft">{link.fn}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-auto overflow-hidden pt-10">
            <div className="rise space-y-3" style={{ '--i': links.length } as React.CSSProperties}>
              <Link href="/start-project" onClick={closeMenu} className="btn btn-solid w-full justify-center">
                Start a project
              </Link>
              <a href="/Ullas_JS_Resume.pdf" download className="btn w-full justify-center">
                Download résumé
              </a>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="btn w-full justify-center">
                <WhatsAppIcon size={18} />
                Message me on WhatsApp
              </a>
              <p className="pt-3 font-mono text-xs text-mute">Kochi, India. Open to remote and relocation.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
