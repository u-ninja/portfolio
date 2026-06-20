'use client';

import { useInView } from '../hooks/useInView';

const skillGroups = [
  {
    category: 'Languages',
    skills: ['JavaScript', 'TypeScript'],
  },
  {
    category: 'Frontend',
    skills: ['React', 'Next.js', 'React Native', 'Expo', 'Tailwind CSS', 'shadcn/ui', 'Ant Design', 'Radix UI', 'TanStack Query', 'TanStack Router', 'Zustand', 'Recharts', 'dnd-kit'],
  },
  {
    category: 'Backend',
    skills: ['Node.js', 'Bun', 'Express.js', 'Prisma', 'TypeORM', 'REST APIs'],
  },
  {
    category: 'Databases',
    skills: ['PostgreSQL', 'MySQL', 'Redis', 'Supabase'],
  },
  {
    category: 'Tools',
    skills: ['Git', 'GitHub', 'Docker', 'Expo EAS'],
  },
  {
    category: 'Bonus',
    skills: ['Godot'],
  },
];

const allSkills = skillGroups.flatMap((g) => g.skills);
const marqueeItems = [...allSkills, ...allSkills];

export function Skills() {
  const { ref, inView } = useInView<HTMLElement>(0.05);

  return (
    <section id="skills" ref={ref} className="py-24 md:py-36 border-t border-[rgba(255,255,255,0.06)]">
      {/* Marquee */}
      <div className="marquee-wrap overflow-hidden mb-20">
        <div className="marquee-track">
          {marqueeItems.map((skill, i) => (
            <span
              key={i}
              className="flex items-center gap-6 px-8 text-xs whitespace-nowrap uppercase tracking-[0.14em]"
              style={{ color: '#3a3a3a' }}
            >
              {skill}
              <span className="w-1 h-1 rounded-full shrink-0" style={{ background: '#2e2e2e' }} />
            </span>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-10">
        {/* Section header */}
        <div className={`mb-16 reveal ${inView ? 'visible' : ''}`}>
          <span className="text-xs tracking-[0.18em] text-[#444] uppercase mb-3 block">Technologies</span>
          <h2
            className="text-4xl md:text-5xl font-bold text-white"
            style={{ fontFamily: 'var(--font-archivo), sans-serif' }}
          >
            Skills
          </h2>
        </div>

        {/* Skill groups */}
        <div className="space-y-0">
          {skillGroups.map((group, i) => (
            <div
              key={group.category}
              className={`flex flex-col md:flex-row py-5 border-t border-[rgba(255,255,255,0.05)] reveal reveal-delay-${Math.min(i + 1, 5)} ${inView ? 'visible' : ''}`}
            >
              <div className="md:w-40 shrink-0 mb-3 md:mb-0">
                <span className="text-xs text-[#444] uppercase tracking-[0.12em]">{group.category}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-sm text-[#777] px-3 py-1 rounded-full border border-[rgba(255,255,255,0.07)] hover:border-[rgba(255,255,255,0.15)] hover:text-[#aaa] transition-all duration-200 cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
