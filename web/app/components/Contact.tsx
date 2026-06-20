'use client';

import { useInView } from '../hooks/useInView';

export function Contact() {
  const { ref, inView } = useInView<HTMLElement>(0.1);

  return (
    <section id="contact" ref={ref} className="border-t border-[rgba(255,255,255,0.06)]">
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-24 md:py-36">
        {/* Section label */}
        <div className={`mb-10 reveal ${inView ? 'visible' : ''}`}>
          <span className="text-xs tracking-[0.18em] text-[#444] uppercase">Contact</span>
        </div>

        {/* Main heading */}
        <div className={`mb-14 reveal reveal-delay-1 ${inView ? 'visible' : ''}`}>
          <h2
            className="font-black text-white leading-[0.9] tracking-[-0.03em]"
            style={{
              fontFamily: 'var(--font-archivo), sans-serif',
              fontSize: 'clamp(2.5rem, 8vw, 7rem)',
            }}
          >
            Let&apos;s build
            <br />
            <span className="text-[#333]">something</span>
            <br />
            great.
          </h2>
        </div>

        {/* Email CTA */}
        <div className={`mb-14 reveal reveal-delay-2 ${inView ? 'visible' : ''}`}>
          <a
            href="mailto:ullasjskadakkal75@gmail.com"
            className="group inline-flex items-center gap-3 text-lg md:text-xl text-[#666] hover:text-white transition-colors duration-300 cursor-pointer"
          >
            <span className="border-b border-[#333] group-hover:border-white transition-colors duration-300 pb-0.5">
              hello@ullas.dev
            </span>
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-200"
            >
              <path d="M3 15L15 3M15 3H6M15 3V12" />
            </svg>
          </a>
        </div>

        {/* Social links */}
        <div className={`flex items-center gap-6 reveal reveal-delay-3 ${inView ? 'visible' : ''}`}>
          {[
            { label: 'GitHub', href: 'https://github.com/UllasJs/' },
            { label: 'LinkedIn', href: 'https://linkedin.com/in/ullas-js-7694391b2/' },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-[#444] hover:text-white transition-colors duration-200 cursor-pointer"
            >
              {link.label}
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M2 8L8 2M8 2H4M8 2V6" />
              </svg>
            </a>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-[rgba(255,255,255,0.04)] py-6">
        <div className="max-w-6xl mx-auto px-6 md:px-10 flex flex-col md:flex-row items-center justify-between gap-3">
          <span className="text-xs text-[#333]">© 2024 Ullas. All rights reserved.</span>
          <span className="text-xs text-[#222]">Designed &amp; built with Next.js</span>
        </div>
      </div>
    </section>
  );
}
