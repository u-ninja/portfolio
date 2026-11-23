export type Project = {
  slug: string;
  title: string;
  tagline: string;
  role: string;
  year: string;
  tech: string[];
  links: { label: string; href: string }[];
  steps: { h: string; body: string }[]; // each step drives one stage of the demo
};

export const projects: Project[] = [
  {
    slug: 'teeme',
    title: 'Teeme',
    tagline: 'Project management SaaS for software teams. Designed, built and launched solo.',
    role: 'Founder and engineer', year: '2025',
    tech: ['Next.js', 'TypeScript', 'Node.js', 'Express on Bun', 'PostgreSQL', 'Prisma', 'Claude API', 'Zod'],
    links: [{ label: 'teeme.org', href: 'https://teeme.org' }],
    steps: [
      { h: 'What it is', body: 'Sprints, live Kanban boards, time tracking and analytics in one place. I owned every part of it: product, design, code and launch.' },
      { h: 'A board that stays live', body: 'Work moves across columns as the team moves it. The board is the product’s centre, so it had to feel instant and never show two people different truths.' },
      { h: 'An assistant that asks first', body: 'Type or say what you want and the AI assistant turns it into board actions. It shows what it is about to do, waits for approval, and can only act within the role of the person asking.' },
      { h: 'How it is built', body: 'A multi-tenant Org, Team and Project permission model sits under everything. Every API is JWT-protected and validates its input with Zod before touching PostgreSQL through Prisma.' },
    ],
  },
  {
    slug: 'erp',
    title: 'Config-driven ERP platform',
    tagline: 'One codebase that ships as separate, fully branded client products.',
    role: 'Full-stack engineer', year: '2025',
    tech: ['React 19', 'TypeScript', 'TanStack', 'JWT', 'RBAC'],
    links: [
      { label: 'Live client ERP', href: 'https://admin.ftrsteel.com' },
      { label: 'Demo', href: 'https://steelops.teeme.org' },
    ],
    steps: [
      { h: 'What it is', body: 'It runs a steel fabrication company’s production ERP: job orders, workforce management and inventory, with role-based access.' },
      { h: 'A new client is a new file', body: 'Modules, roles, workflows and theming all come from a single JSON config. A new client instance goes live in about 5 minutes with no code changes.' },
      { h: 'Roles decide what exists', body: 'Access is part of the config, not scattered through the UI. Sign in with a different role and the product itself changes shape.' },
      { h: 'Why build it this way', body: 'Custom ERPs usually mean a fork per client and a maintenance bill that grows with each one. Here every client runs the same codebase, so a fix is written once.' },
    ],
  },
  {
    slug: 'qlueprint',
    title: 'QluePrint',
    tagline: 'A local-first desktop workspace for every database. No account, no cloud, no telemetry.',
    role: 'Creator', year: '2026',
    tech: ['Tauri', 'Rust', 'React', 'TypeScript', 'Monaco', 'sqlx'],
    links: [{ label: 'GitHub', href: 'https://github.com/u-ninja/qlueprint' }],
    steps: [
      { h: 'What it is', body: 'Connect to PostgreSQL, MySQL, MariaDB, SQL Server and SQLite, write and run SQL with schema-aware autocomplete, and browse the results in a fast virtualized grid.' },
      { h: 'Editing without fear', body: 'Edits to cells and rows are staged, undoable and saved in one transaction. Actions your database login isn’t granted are hidden, not left to fail.' },
      { h: 'A record of everything', body: 'The app keeps a tamper-evident audit log, on your machine, of every statement it ran against your databases.' },
      { h: 'How it is built', body: 'A React and Monaco interface talks to a Rust core through Tauri. The Rust side owns the database drivers, and credentials live in the operating system’s keychain.' },
    ],
  },
  {
    slug: 'ninjatrade',
    title: 'NinjaTrade',
    tagline: 'A personal paper-trading platform for monthly index and crypto investing.',
    role: 'Solo developer', year: '2026',
    tech: ['Python', 'FastAPI', 'pandas', 'React 19', 'ECharts', 'systemd', 'Caddy', 'Cloudflare Access'],
    links: [],
    steps: [
      { h: 'What it is', body: 'A daily job fetches market prices, invests a monthly amount on paper using backtested rules, and sends a Telegram summary. Paper money only, by design.' },
      { h: 'Rule one: the trend', body: 'The job checks the long-term trend before it does anything. When the market is below its 200-day trend, the flow takes a different branch.' },
      { h: 'Rule two: the fear gate', body: 'A fear-gauge gate is checked next. Rules like these are easy to state and easy to get subtly wrong, which is why the job only uses rules that were backtested first.' },
      { h: 'How it runs', body: 'A FastAPI and React app shows the portfolio, backtests and live server health. It runs on a hardened VM behind Cloudflare Access and Tailscale.' },
    ],
  },
];