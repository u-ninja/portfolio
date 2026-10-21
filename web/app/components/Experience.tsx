'use client';

import { useInView } from '../hooks/useInView';

const jobs = [
  {
    company: 'Digitrell',
    location: 'Kochi, India',
    role: 'Senior Software Engineer',
    period: 'Jan 2026 – Present',
    note: 'Software Engineer Apr 2025 – Dec 2025 · promoted after 9 months',
    points: [
      'Lead a team of 3–5 engineers on enterprise client projects; introduced the team’s code review workflow and technical standards.',
      'Shipped 230+ fixes and features across 7 services in three weeks using AI-assisted development, with about 90 production deploys on Azure Container Apps.',
      'Kept production stable while releasing about 29 times a week, using hotfix branches, revision-based deploys and deploy-pipeline fixes.',
      'Integrated a second warehouse with a SCALE WMS: two-way sync of customers, carriers, buildings and appointments, with per-facility access.',
      'Architected a high-concurrency warehouse platform integrated with SAP S/4HANA, with real-time Socket.IO dashboards for live operations.',
      'Increased data-entry throughput by 40% by rewriting nested legacy queries and redesigning batch processing.',
      'Designed a transaction-safe ledger pipeline for automated cashflow posting with a complete audit trail, on Azure with API Management and CI/CD.',
    ],
  },
  {
    company: 'FPLE Technologies',
    location: 'Bengaluru, India',
    role: 'Frontend Developer',
    period: 'Jan 2024 – Mar 2025',
    points: [
      'Improved Core Web Vitals and initial page load by 30% by moving key pages to server-side and static rendering in Nuxt.js.',
      'Built a reusable Vue.js component library with centralized Pinia state, speeding up delivery and keeping the UI consistent across products.',
    ],
  },
  {
    company: 'Scipy Technologies',
    location: 'Thiruvananthapuram, India',
    role: 'MERN Stack Developer',
    period: 'Jan 2023 – Jan 2024',
    points: [
      'Migrated legacy multi-page workflows to React SPAs and built modular REST APIs in Node.js, TypeScript and MongoDB.',
    ],
  },
];

export function Experience() {
  const { ref, inView } = useInView<HTMLElement>(0.05);

  return (
    <section id="experience" ref={ref} className="py-24 md:py-36 border-t border-[rgba(255,255,255,0.06)]">
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        {/* Section header */}
        <div className={`mb-16 reveal ${inView ? 'visible' : ''}`}>
          <span className="text-xs tracking-[0.18em] text-[#444] uppercase mb-3 block">Career</span>
          <h2
            className="text-4xl md:text-5xl font-bold text-white"
            style={{ fontFamily: 'var(--font-archivo), sans-serif' }}
          >
            Experience
          </h2>
        </div>

        {/* Jobs */}
        <div className="space-y-0">
          {jobs.map((job, i) => (
            <div
              key={job.company}
              className={`flex flex-col md:flex-row gap-4 md:gap-12 py-10 border-t border-[rgba(255,255,255,0.05)] reveal reveal-delay-${i + 1} ${inView ? 'visible' : ''}`}
            >
              <div className="md:w-56 shrink-0">
                <span className="text-xs text-[#444] uppercase tracking-[0.12em]">{job.period}</span>
              </div>
              <div className="flex-1">
                <h3
                  className="text-xl md:text-2xl font-bold text-white mb-1"
                  style={{ fontFamily: 'var(--font-archivo), sans-serif' }}
                >
                  {job.role} · {job.company}
                </h3>
                <p className="text-xs text-[#444] mb-5">
                  {job.location}
                  {job.note && ` · ${job.note}`}
                </p>
                <ul className="space-y-2 max-w-2xl">
                  {job.points.map((point) => (
                    <li key={point} className="text-[#555] text-sm leading-relaxed pl-4 relative">
                      <span className="absolute left-0 top-[0.6em] w-1 h-1 rounded-full bg-[#333]" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
