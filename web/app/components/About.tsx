'use client';

import { useInView } from '../hooks/useInView';

export function About() {
  const { ref, inView } = useInView<HTMLElement>(0.1);

  return (
    <section id="about" ref={ref} className="py-24 md:py-36 border-t border-[rgba(255,255,255,0.06)]">
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20">
          {/* Left: heading */}
          <div className={`reveal ${inView ? 'visible' : ''}`}>
            <span className="text-xs tracking-[0.18em] text-[#444] uppercase mb-3 block">About</span>
            <h2
              className="text-4xl md:text-5xl font-bold text-white leading-tight"
              style={{ fontFamily: 'var(--font-archivo), sans-serif' }}
            >
              Crafting
              <br />
              <span className="text-[#333]">digital</span>
              <br />
              products
            </h2>
          </div>

          {/* Right: text */}
          <div className={`space-y-5 reveal reveal-delay-2 ${inView ? 'visible' : ''}`}>
            <p className="text-[#666] leading-relaxed">
              I&apos;m a full-stack developer who loves turning complex problems into clean, usable software.
              I work across the entire stack — from designing database schemas and building APIs to crafting
              polished user interfaces.
            </p>
            <p className="text-[#555] leading-relaxed">
              My recent work spans enterprise-grade admin dashboards, Kanban-based project management
              platforms, and cross-platform mobile apps with React Native and Expo. I care deeply about
              performance, code quality, and great user experiences.
            </p>
            <p className="text-[#444] leading-relaxed">
              When I&apos;m not building, I&apos;m exploring game development with Godot or diving into new tools
              in the JS/TS ecosystem.
            </p>

            {/* Email link */}
            <div className="pt-4">
              <a
                href="mailto:ullasjskadakkal75@gmail.com"
                className="inline-flex items-center gap-2 text-sm text-[#666] hover:text-white transition-colors duration-200 group cursor-pointer"
              >
                <span className="border-b border-[#333] group-hover:border-white transition-colors duration-300 pb-0.5">
                  hello@ullas.dev
                </span>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200"
                >
                  <path d="M2 12L12 2M12 2H5M12 2V9" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
