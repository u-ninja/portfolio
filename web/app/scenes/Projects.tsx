'use client';
import { useEffect, useRef, useState, type ComponentType } from 'react';
import { SceneHead } from './SceneHead';
import { TeemeDemo } from './demos/TeemeDemo';
import { ErpDemo } from './demos/ErpDemo';
import { QlueDemo } from './demos/QlueDemo';
import { NinjaDemo } from './demos/NinjaDemo';
import { BlacksiteDemo } from './demos/BlacksiteDemo';

type Project = {
  title: string;
  tagline: string;
  role: string;
  year: string;
  tech: string[];
  links: { label: string; href: string }[];
  steps: { h: string; body: string }[]; // each step drives one stage of the demo
  Demo: ComponentType<{ stage: number }>;
};

const projects: Project[] = [
  {
    title: 'Teeme',
    tagline: 'Project management SaaS for software teams. Designed, built and launched solo.',
    role: 'Founder and engineer', year: '2025',
    tech: ['Next.js', 'TypeScript', 'Node.js', 'Express on Bun', 'PostgreSQL', 'Prisma', 'Claude API', 'Zod'],
    links: [{ label: 'teeme.org', href: 'https://teeme.org' }],
    Demo: TeemeDemo,
    steps: [
      { h: 'What it is', body: 'Sprints, live Kanban boards, time tracking and analytics in one place. I owned every part of it: product, design, code and launch.' },
      { h: 'A board that stays live', body: 'Work moves across columns as the team moves it. The board is the product’s centre, so it had to feel instant and never show two people different truths.' },
      { h: 'An assistant that asks first', body: 'Type or say what you want and the AI assistant turns it into board actions. It shows what it is about to do, waits for approval, and can only act within the role of the person asking.' },
      { h: 'How it is built', body: 'A multi-tenant Org, Team and Project permission model sits under everything. Every API is JWT-protected and validates its input with Zod before touching PostgreSQL through Prisma.' },
    ],
  },
  {
    title: 'Config-driven ERP platform',
    tagline: 'One codebase that ships as separate, fully branded client products.',
    role: 'Full-stack engineer', year: '2025',
    tech: ['React 19', 'TypeScript', 'TanStack', 'JWT', 'RBAC'],
    links: [
      { label: 'Live client ERP', href: 'https://admin.ftrsteel.com' },
      { label: 'Demo', href: 'https://steelops.teeme.org' },
    ],
    Demo: ErpDemo,
    steps: [
      { h: 'What it is', body: 'It runs a steel fabrication company’s production ERP: job orders, workforce management and inventory, with role-based access.' },
      { h: 'A new client is a new file', body: 'Modules, roles, workflows and theming all come from a single JSON config. A new client instance goes live in about 5 minutes with no code changes.' },
      { h: 'Roles decide what exists', body: 'Access is part of the config, not scattered through the UI. Sign in with a different role and the product itself changes shape.' },
      { h: 'Why build it this way', body: 'Custom ERPs usually mean a fork per client and a maintenance bill that grows with each one. Here every client runs the same codebase, so a fix is written once.' },
    ],
  },
  {
    title: 'QluePrint',
    tagline: 'A local-first desktop workspace for every database. No account, no cloud, no telemetry.',
    role: 'Creator', year: '2026',
    tech: ['Tauri', 'Rust', 'React', 'TypeScript', 'Monaco', 'sqlx'],
    links: [{ label: 'GitHub', href: 'https://github.com/u-ninja/qlueprint' }],
    Demo: QlueDemo,
    steps: [
      { h: 'What it is', body: 'Connect to PostgreSQL, MySQL, MariaDB, SQL Server and SQLite, write and run SQL with schema-aware autocomplete, and browse the results in a fast virtualized grid.' },
      { h: 'Editing without fear', body: 'Edits to cells and rows are staged, undoable and saved in one transaction. Actions your database login isn’t granted are hidden, not left to fail.' },
      { h: 'A record of everything', body: 'The app keeps a tamper-evident audit log, on your machine, of every statement it ran against your databases.' },
      { h: 'How it is built', body: 'A React and Monaco interface talks to a Rust core through Tauri. The Rust side owns the database drivers, and credentials live in the operating system’s keychain.' },
    ],
  },
  {
    title: 'NinjaTrade',
    tagline: 'A personal paper-trading platform for monthly index and crypto investing.',
    role: 'Solo developer', year: '2026',
    tech: ['Python', 'FastAPI', 'pandas', 'React 19', 'ECharts', 'systemd', 'Caddy', 'Cloudflare Access'],
    links: [],
    Demo: NinjaDemo,
    steps: [
      { h: 'What it is', body: 'A daily job fetches market prices, invests a monthly amount on paper using backtested rules, and sends a Telegram summary. Paper money only, by design.' },
      { h: 'Rule one: the trend', body: 'The job checks the long-term trend before it does anything. When the market is below its 200-day trend, the flow takes a different branch.' },
      { h: 'Rule two: the fear gate', body: 'A fear-gauge gate is checked next. Rules like these are easy to state and easy to get subtly wrong, which is why the job only uses rules that were backtested first.' },
      { h: 'How it runs', body: 'A FastAPI and React app shows the portfolio, backtests and live server health. It runs on a hardened VM behind Cloudflare Access and Tailscale.' },
    ],
  },
  {
    title: 'Blacksite',
    tagline: 'A tactical top-down shooter prototype, built to learn how game systems fit together.',
    role: 'Solo developer', year: '2026',
    tech: ['Godot 4', 'GDScript', 'Raycasting', 'State machines', 'Headless tests'],
    links: [],
    Demo: BlacksiteDemo,
    steps: [
      { h: 'What it is', body: 'Round-based, Blue against Red, first to five. You only see an enemy while your operator actually can, which makes every corner a decision.' },
      { h: 'Two layers of sight', body: 'Something is visible when it is inside either awareness layer and a ray to it is clear. Peripheral vision is wide and short. Weapon sight is narrow and far, so it changes with the gun.' },
      { h: 'Physics in layers', body: 'Movement, bullets, vision and actors each get their own collision layer. Low cover stops bullets but not sight, simply by leaving the vision layer off.' },
      { h: 'Tested like software', body: 'Gameplay rules run as headless tests that exit with a failure the moment something breaks, the same way I would test a service.' },
    ],
  },
];

function Showcase({ project }: { project: Project }) {
  const ref = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const steps = ref.current?.querySelectorAll('[data-step]');
    if (!steps) return;
    // the step crossing mid-viewport sets the demo's stage, in either scroll direction
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setStage(Number((e.target as HTMLElement).dataset.step));
      },
      // on small screens the demo is pinned over the top half, so the trigger line sits lower
      { rootMargin: window.matchMedia('(min-width: 1024px)').matches ? '-50% 0px -50% 0px' : '-80% 0px -20% 0px' },
    );
    steps.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  const { Demo } = project;
  return (
    <article className="border-t border-line pt-14 md:pt-20">
      <header className="mb-8 grid gap-6 md:mb-4 md:grid-cols-[1.4fr_1fr] md:items-end">
        <div>
          <h3 className="display mb-4 text-[clamp(2.4rem,6vw,5rem)]">{project.title}</h3>
          <p className="max-w-xl text-lg leading-relaxed text-mute">{project.tagline}</p>
        </div>
        <div className="font-mono text-xs leading-6 text-mute md:text-right">
          <p className="text-paper">{project.role}, {project.year}</p>
          <p>{project.tech.join(' / ')}</p>
          <p className="mt-2 flex flex-wrap gap-4 md:justify-end">
            {project.links.map((l) => (
              <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="text-signal-soft underline underline-offset-4 hover:text-paper">
                {l.label}
              </a>
            ))}
          </p>
        </div>
      </header>

      <div ref={ref} className="lg:grid lg:grid-cols-2 lg:gap-16">
        <div className="sticky top-[68px] z-10 -mx-6 h-[54svh] min-h-[390px] bg-ink px-6 py-3 md:-mx-10 md:px-10 lg:order-2 lg:top-[14vh] lg:mx-0 lg:h-[72vh] lg:max-h-[560px] lg:bg-transparent lg:p-0">
          <Demo stage={stage} />
        </div>
        <ol>
          {project.steps.map((s, i) => (
            <li
              key={s.h}
              data-step={i}
              className={`flex min-h-[52vh] flex-col justify-center transition-opacity duration-500 lg:min-h-[72vh] ${stage === i ? 'opacity-100' : 'opacity-35'}`}
            >
              <p className="mb-3 font-mono text-xs text-signal-soft">
                {i + 1} / {project.steps.length}
              </p>
              <h4 className="mb-3 text-2xl font-semibold md:mb-4 md:text-4xl">{s.h}</h4>
              <p className="max-w-md leading-relaxed text-mute md:text-lg">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </article>
  );
}

export function Projects() {
  return (
    <section id="work" data-shape="dust" data-alpha="0.22" className="relative px-6 py-24 md:px-10 md:py-36">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 md:mb-24">
          <SceneHead fn="projects.forEach(ship)" title="Selected work">
            Five things I built and shipped. Each one is a working demo: scroll to follow the story, or use the controls
            yourself.
          </SceneHead>
        </div>
        <div className="space-y-20 md:space-y-28">
          {projects.map((p) => <Showcase key={p.title} project={p} />)}
        </div>
      </div>
    </section>
  );
}
