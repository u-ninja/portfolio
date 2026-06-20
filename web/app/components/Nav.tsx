'use client';
import { useState, useEffect, useRef } from 'react';

const links = [
  { label: 'Work', href: '#work' },
  { label: 'Skills', href: '#skills' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
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
          background: scrolled || menuOpen ? 'rgba(8,8,8,0.92)' : 'transparent',
          backdropFilter: scrolled || menuOpen ? 'blur(16px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
        }}
      >
        <nav className="max-w-6xl mx-auto px-6 md:px-10 h-[68px] flex items-center justify-between">
          {/* Logo */}
          <a
            href="#"
            className="text-white font-bold text-xl tracking-tight hover:opacity-70 transition-opacity duration-200"
            style={{ fontFamily: 'var(--font-archivo), sans-serif' }}
          >
            ullas.
          </a>

          {/* Desktop nav links */}
          <ul className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-sm text-[#666] hover:text-white transition-colors duration-200 tracking-wide cursor-pointer"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Desktop CTA */}
          <a
            href="#contact"
            className="hidden md:inline-flex text-sm px-4 py-2 rounded-full border border-[rgba(255,255,255,0.15)] text-[#ccc] hover:bg-white hover:text-black hover:border-white transition-all duration-200 cursor-pointer"
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

      {/* Backdrop — click to close */}
      <div
        aria-hidden="true"
        className={`mobile-nav-overlay ${menuOpen ? 'open' : ''}`}
        onClick={closeMenu}
      />

      {/* Drawer */}
      <div
        id="mobile-nav-drawer"
        ref={drawerRef}
        role="dialog"
        aria-label="Navigation menu"
        aria-modal="true"
        className={`mobile-nav-drawer ${menuOpen ? 'open' : ''}`}
      >
        <div className="flex flex-col h-full px-8 pt-24 pb-10">
          <nav aria-label="Mobile navigation">
            <ul className="space-y-0">
              {links.map((link, i) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={closeMenu}
                    className="flex items-center justify-between py-5 border-b border-[rgba(255,255,255,0.05)] text-2xl font-semibold text-[#666] hover:text-white transition-colors duration-200 cursor-pointer group"
                    style={{
                      fontFamily: 'var(--font-archivo), sans-serif',
                      transitionDelay: menuOpen ? `${i * 50}ms` : '0ms',
                    }}
                  >
                    <span>{link.label}</span>
                    <svg
                      width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"
                      className="opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-200"
                    >
                      <path d="M3 13L13 3M13 3H6M13 3V10" />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* CTA at bottom */}
          <div className="mt-auto pt-8">
            <a
              href="#contact"
              onClick={closeMenu}
              className="flex items-center justify-center w-full py-4 rounded-full bg-white text-black text-sm font-semibold hover:bg-[#c4f135] transition-colors duration-200 cursor-pointer"
            >
              Get in touch
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
