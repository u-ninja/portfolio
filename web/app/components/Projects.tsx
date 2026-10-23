'use client';

import { useInView } from '../hooks/useInView';

const projects = [
  {
    num: '01',
    title: 'Config-Driven ERP Platform',
    tagline: 'One codebase, many fully branded client products',
    description:
      'Ships as separate, fully branded products from a single JSON config (modules, roles, workflows, theming) — a new client instance goes live in about 5 minutes with no code changes. Runs a steel fabrication company\'s production ERP: job orders, workforce management and inventory with role-based access.',
    tech: ['React 19', 'TypeScript', 'TanStack', 'JWT', 'RBAC'],
    links: [
      { label: 'Live client ERP', href: 'https://admin.ftrsteel.com' },
      { label: 'Demo', href: 'https://steelops.teeme.org' },
    ],
    role: 'Full-Stack Engineer',
    year: '2025',
    type: 'Web Application',
    mockup: {
      type: 'browser' as const,
      accent: '#3b82f6',
      nav: ['Dashboard', 'Job Orders', 'Workforce', 'Inventory', 'Reports', 'Settings'],
      rows: [
        { w: '55%', h: 10, opacity: 0.25 },
        { w: '35%', h: 10, opacity: 0.12 },
      ],
      cards: [
        { label: 'Job Orders', value: '64', color: '#3b82f6' },
        { label: 'Workforce', value: '248', color: '#f59e0b' },
        { label: 'Inventory', value: '1.2k', color: '#10b981' },
        { label: 'Roles', value: '6', color: '#8b5cf6' },
      ],
    },
  },
  {
    num: '02',
    title: 'Teeme',
    tagline: 'SaaS project management for software teams — designed, built and launched solo',
    description:
      'Sprints, live Kanban boards, time tracking and analytics on a multi-tenant Org/Team/Project permission model with Zod-validated, JWT-protected APIs. Includes an AI assistant that turns plain-language or voice commands into board actions, asks for approval and only acts within the user\'s role.',
    tech: ['Next.js', 'TypeScript', 'Node.js', 'Express', 'Bun', 'PostgreSQL', 'Prisma', 'Claude API', 'Zod'],
    links: [{ label: 'teeme.org', href: 'https://teeme.org' }],
    role: 'Founder & Engineer',
    year: '2025',
    type: 'SaaS',
    mockup: {
      type: 'split' as const,
      accent: '#8b5cf6',
      columns: [
        { label: 'To Do', color: '#3f3f46', items: ['Auth flow', 'Onboarding', 'Settings'] },
        { label: 'In Progress', color: '#1d4ed8', items: ['Kanban board', 'Search'] },
        { label: 'Done', color: '#065f46', items: ['API setup', 'DB schema', 'OAuth'] },
      ],
    },
  },
  {
    num: '03',
    title: 'NinjaTrade',
    tagline: 'Personal paper-trading platform for monthly index and crypto investing',
    description:
      'A daily job fetches market prices, invests a monthly amount on paper using backtested rules (200-day trend, fear-gauge gates) and sends a Telegram summary. A FastAPI + React web app shows the portfolio, backtests and live server health, deployed on a hardened VM behind Cloudflare Access and Tailscale. Paper money only, by design.',
    tech: ['Python', 'FastAPI', 'pandas', 'React 19', 'TypeScript', 'ECharts', 'systemd', 'Caddy', 'Cloudflare Access'],
    links: [] as { label: string; href: string }[],
    role: 'Solo Developer',
    year: '2026',
    type: 'Web Application',
    mockup: {
      type: 'browser' as const,
      accent: '#10b981',
      nav: ['Today', 'Portfolio', 'Plan', 'Lab', 'System', 'Status'],
      rows: [],
      cards: [
        { label: 'Invested', value: '₹60k', color: '#10b981' },
        { label: 'Return', value: '+8.4%', color: '#3b82f6' },
        { label: 'Fear & Greed', value: '38', color: '#f59e0b' },
        { label: 'Next buy', value: '1 Nov', color: '#8b5cf6' },
      ],
    },
  },
];

// ── Mockup components ────────────────────────────────────────────────────────

function BrowserMockup({ mockup }: { mockup: typeof projects[0]['mockup'] & { type: 'browser' } }) {
  return (
    <div
      className="w-full rounded-xl overflow-hidden border border-[rgba(255,255,255,0.08)]"
      style={{ background: '#0d0d0d' }}
    >
      {/* Browser chrome */}
      <div className="flex items-center gap-1.5 px-4 py-3 border-b border-[rgba(255,255,255,0.06)]" style={{ background: '#111' }}>
        <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
        <div className="flex-1 mx-4 h-5 rounded-md bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.06)]" />
      </div>

      {/* Content area */}
      <div className="p-4 md:p-6">
        {/* Sidebar + main layout */}
        <div className="flex gap-4 h-[220px] md:h-[280px]">
          {/* Sidebar */}
          <div className="w-[140px] shrink-0 space-y-1.5">
            {mockup.nav.map((item, i) => (
              <div
                key={item}
                className="h-7 rounded-md flex items-center px-2.5"
                style={{
                  background: i === 0 ? `${mockup.accent}18` : 'transparent',
                  borderLeft: i === 0 ? `2px solid ${mockup.accent}` : '2px solid transparent',
                }}
              >
                <div className="w-2 h-2 rounded-sm mr-2" style={{ background: i === 0 ? mockup.accent : 'rgba(255,255,255,0.08)' }} />
                <div className="h-1.5 rounded-full" style={{ width: `${50 + i * 8}%`, background: i === 0 ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.08)' }} />
              </div>
            ))}
          </div>

          {/* Main area */}
          <div className="flex-1 flex flex-col gap-3">
            {/* Stat cards */}
            <div className="grid grid-cols-2 gap-2 shrink-0">
              {mockup.cards.map((card) => (
                <div
                  key={card.label}
                  className="rounded-lg p-3 border border-[rgba(255,255,255,0.06)]"
                  style={{ background: `${card.color}10` }}
                >
                  <div className="text-[9px] mb-1.5" style={{ color: 'rgba(255,255,255,0.3)' }}>{card.label}</div>
                  <div className="text-base font-bold" style={{ color: card.color, fontFamily: 'var(--font-archivo), sans-serif' }}>{card.value}</div>
                </div>
              ))}
            </div>

            {/* Table rows */}
            <div className="flex-1 rounded-lg border border-[rgba(255,255,255,0.05)] overflow-hidden">
              <div className="flex gap-3 px-3 py-2 border-b border-[rgba(255,255,255,0.04)]">
                {['Name', 'Status', 'Date', 'Hours'].map((h) => (
                  <div key={h} className="h-1.5 rounded-full flex-1" style={{ background: 'rgba(255,255,255,0.06)' }} />
                ))}
              </div>
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex gap-3 px-3 py-2 border-b border-[rgba(255,255,255,0.03)]">
                  <div className="h-1.5 rounded-full flex-1" style={{ background: 'rgba(255,255,255,0.08)' }} />
                  <div className="h-1.5 rounded-full w-12" style={{ background: i % 3 === 0 ? '#10b98130' : i % 3 === 1 ? '#f59e0b30' : '#3b82f630' }} />
                  <div className="h-1.5 rounded-full flex-1" style={{ background: 'rgba(255,255,255,0.05)' }} />
                  <div className="h-1.5 rounded-full w-10" style={{ background: 'rgba(255,255,255,0.07)' }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function KanbanMockup({ mockup }: { mockup: typeof projects[1]['mockup'] & { type: 'split' } }) {
  return (
    <div className="w-full flex gap-3 md:gap-4">
      {/* Browser (web) */}
      <div
        className="flex-1 rounded-xl overflow-hidden border border-[rgba(255,255,255,0.08)]"
        style={{ background: '#0d0d0d' }}
      >
        {/* Browser chrome */}
        <div className="flex items-center gap-1.5 px-4 py-3 border-b border-[rgba(255,255,255,0.06)]" style={{ background: '#111' }}>
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
          <div className="flex-1 mx-3 h-4 rounded-md bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.06)]" />
        </div>

        {/* Kanban board */}
        <div className="p-3 md:p-4">
          <div className="flex gap-2 md:gap-3 overflow-hidden h-[200px] md:h-[250px]">
            {mockup.columns.map((col) => (
              <div key={col.label} className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-2">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: col.color }} />
                  <span className="text-[8px] md:text-[9px] uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.3)' }}>{col.label}</span>
                </div>
                <div className="space-y-1.5">
                  {col.items.map((item) => (
                    <div
                      key={item}
                      className="rounded-md p-2 border border-[rgba(255,255,255,0.06)]"
                      style={{ background: 'rgba(255,255,255,0.03)' }}
                    >
                      <div className="h-1 rounded-full mb-1.5 w-full" style={{ background: 'rgba(255,255,255,0.1)' }} />
                      <div className="h-1 rounded-full w-2/3" style={{ background: 'rgba(255,255,255,0.06)' }} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Phone (mobile) */}
      <div
        className="hidden sm:flex w-[90px] md:w-[110px] shrink-0 rounded-2xl overflow-hidden border-2 border-[rgba(255,255,255,0.1)] flex-col"
        style={{ background: '#0d0d0d' }}
      >
        {/* Notch */}
        <div className="flex justify-center pt-2 pb-1" style={{ background: '#111' }}>
          <div className="w-10 h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }} />
        </div>

        {/* App content */}
        <div className="flex-1 p-2 space-y-2">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="h-2 w-12 rounded-full" style={{ background: 'rgba(255,255,255,0.12)' }} />
            <div className="w-4 h-4 rounded-full" style={{ background: mockup.accent + '30' }} />
          </div>
          {/* Mini cards */}
          {['Sprint 4', 'Bug fix', 'Review', 'Design'].map((_, i) => (
            <div key={i} className="rounded-md p-1.5 border border-[rgba(255,255,255,0.06)]" style={{ background: 'rgba(255,255,255,0.02)' }}>
              <div className="h-1 rounded-full mb-1" style={{ width: `${60 + i * 10}%`, background: 'rgba(255,255,255,0.1)' }} />
              <div className="h-1 rounded-full w-1/2" style={{ background: 'rgba(255,255,255,0.05)' }} />
            </div>
          ))}
        </div>

        {/* Bottom tab bar */}
        <div className="flex justify-around py-2 border-t border-[rgba(255,255,255,0.06)]">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="w-4 h-4 rounded" style={{ background: i === 0 ? mockup.accent + '40' : 'rgba(255,255,255,0.05)' }} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function Projects() {
  const { ref, inView } = useInView<HTMLElement>(0.05);

  return (
    <section id="work" ref={ref} className="py-24 md:py-36 border-t border-[rgba(255,255,255,0.06)]">
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        {/* Section header */}
        <div className={`flex items-end justify-between mb-16 reveal ${inView ? 'visible' : ''}`}>
          <div>
            <span className="text-xs tracking-[0.18em] text-[#444] uppercase mb-3 block">Selected Work</span>
            <h2
              className="text-4xl md:text-5xl font-bold text-white"
              style={{ fontFamily: 'var(--font-archivo), sans-serif' }}
            >
              Projects
            </h2>
          </div>
          <span className="text-[#333] text-sm tabular-nums">{String(projects.length).padStart(2, '0')} projects</span>
        </div>

        {/* Projects list */}
        <div className="space-y-0">
          {projects.map((project, i) => (
            <ProjectCard key={project.num} project={project} index={i} parentInView={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({
  project,
  index,
  parentInView,
}: {
  project: typeof projects[0];
  index: number;
  parentInView: boolean;
}) {
  const { ref, inView } = useInView<HTMLDivElement>(0.1);

  return (
    <div
      ref={ref}
      className={`group relative border-t border-[rgba(255,255,255,0.06)] py-10 md:py-14 transition-all duration-300 hover:bg-[rgba(255,255,255,0.015)] rounded-lg -mx-4 px-4 reveal ${inView || parentInView ? 'visible' : ''}`}
      style={{ transitionDelay: `${index * 0.15}s` }}
    >
      <div className="flex flex-col md:flex-row md:gap-12">
        {/* Number */}
        <div className="shrink-0 mb-4 md:mb-0 md:w-16 md:pt-1">
          <span className="text-xs font-mono text-[#333] tracking-widest">
            {project.num}
          </span>
        </div>

        {/* Main content */}
        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-5">
            <div>
              <h3
                className="text-2xl md:text-3xl font-bold text-white mb-2 group-hover:text-[#f5f5f5] transition-colors"
                style={{ fontFamily: 'var(--font-archivo), sans-serif' }}
              >
                {project.title}
              </h3>
              <p className="text-[#666] text-base">{project.tagline}</p>
            </div>

            {/* Meta */}
            <div className="shrink-0 flex md:flex-col md:items-end gap-3 md:gap-1 text-xs text-[#444]">
              <span>{project.type}</span>
              <span className="hidden md:block">·</span>
              <span>{project.year}</span>
            </div>
          </div>

          <p className="text-[#555] text-sm leading-relaxed mb-6 max-w-2xl">
            {project.description}
          </p>

          {/* Mockup */}
          <div className="mb-6">
            {project.mockup.type === 'browser' ? (
              <BrowserMockup mockup={project.mockup as typeof projects[0]['mockup'] & { type: 'browser' }} />
            ) : (
              <KanbanMockup mockup={project.mockup as typeof projects[1]['mockup'] & { type: 'split' }} />
            )}
          </div>

          {/* Tech chips */}
          <div className="flex flex-wrap gap-2 mb-6">
            {project.tech.slice(0, 8).map((t) => (
              <span
                key={t}
                className="text-xs px-2.5 py-1 rounded-md bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)] text-[#666]"
              >
                {t}
              </span>
            ))}
            {project.tech.length > 8 && (
              <span className="text-xs px-2.5 py-1 rounded-md bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)] text-[#444]">
                +{project.tech.length - 8} more
              </span>
            )}
          </div>

          {/* Role + links */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <span className="text-xs text-[#444] tracking-wider uppercase">{project.role}</span>
            {project.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-[#666] hover:text-white transition-colors duration-200 cursor-pointer"
              >
                {link.label}
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M2 8L8 2M8 2H4M8 2V6" />
                </svg>
              </a>
            ))}
          </div>
        </div>

        {/* Arrow (appears on hover) */}
        <div className="shrink-0 hidden md:flex items-start pt-1 opacity-0 group-hover:opacity-100 transition-all duration-200 -translate-x-2 group-hover:translate-x-0">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#444" strokeWidth="1.5">
            <path d="M4 16L16 4M16 4H8M16 4V12" />
          </svg>
        </div>
      </div>
    </div>
  );
}
