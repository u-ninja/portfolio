// The facts every tailored CV is built from. The model may select, reorder and rephrase these; it may not add to them.

export type Cv = {
  title: string;
  summary: string;
  jobs: { role: string; company: string; when: string; note?: string; points: string[] }[];
  projects: { name: string; tagline?: string; link: string; stack: string; points: string[] }[];
  skills: { label: string; items: string }[];
};

export type Tailored = { cv: Cv; letter: string[]; gaps: string[] };

export const base: Cv = {
  title: 'Senior Frontend / Full Stack Engineer. React, Next.js, TypeScript, Node.js.',
  summary:
    'Senior engineer with nearly 4 years shipping production web platforms in React, Next.js, TypeScript and Node.js. I lead 3–5 engineers on SAP- and WMS-integrated logistics systems, built a config-driven platform that launches a fully branded client product from a JSON file in about 5 minutes, and launched my own SaaS, Teeme. I work AI-first: in three weeks of October 2026 I shipped 230+ fixes and features with about 90 production deploys, while owning every line I ship.',
  jobs: [
    {
      role: 'Senior Software Engineer', company: 'Digitrell, Kochi, India', when: 'Jan 2026 – Present',
      note: 'Software Engineer, Apr 2025 – Dec 2025. Promoted after 9 months.',
      points: [
        'Lead a team of 3–5 engineers on enterprise client projects; introduced the team’s code review workflow and technical standards.',
        'Shipped 230+ fixes and features across 7 services (Node.js/TypeScript, Next.js, Azure SQL) in three weeks using AI-assisted development, with about 90 production deploys on Azure Container Apps.',
        'Kept production stable while releasing about 29 times a week, using hotfix branches, revision-based deploys and deploy-pipeline fixes.',
        'Integrated a second warehouse with a SCALE WMS: two-way sync of customers, carriers, buildings and appointments, with per-facility access.',
        'Architected a high-concurrency warehouse platform integrated with SAP S/4HANA, with real-time Socket.IO dashboards for live operations.',
        'Increased data-entry throughput by 40% by rewriting nested legacy queries and redesigning batch processing.',
        'Designed a transaction-safe ledger pipeline for automated cashflow posting with a complete audit trail, on Azure with API Management and CI/CD.',
      ],
    },
    {
      role: 'Frontend Developer', company: 'FPLE Technologies, Bengaluru, India', when: 'Jan 2024 – Mar 2025',
      points: [
        'Improved Core Web Vitals and initial page load by 30% by moving key pages to server-side and static rendering in Nuxt.js.',
        'Built a reusable Vue.js component library with centralized Pinia state, speeding up delivery and keeping the UI consistent across products.',
      ],
    },
    {
      role: 'MERN Stack Developer', company: 'Scipy Technologies, Thiruvananthapuram, India', when: 'Jan 2023 – Jan 2024',
      points: ['Migrated legacy multi-page workflows to React SPAs and built modular REST APIs in Node.js, TypeScript and MongoDB.'],
    },
  ],
  projects: [
    {
      name: 'Config-Driven ERP Platform', link: 'admin.ftrsteel.com / demo: steelops.teeme.org',
      stack: 'React 19 / TypeScript / TanStack / JWT / RBAC',
      points: [
        'One codebase ships as separate, fully branded products from a single JSON config (modules, roles, workflows, theming); a new client instance goes live in about 5 minutes with no code changes.',
        'Runs a steel fabrication company’s production ERP: job orders, workforce management and inventory with role-based access.',
      ],
    },
    {
      name: 'Teeme', tagline: 'SaaS project management for software teams', link: 'teeme.org',
      stack: 'Next.js / TypeScript / Node.js, Express on Bun / PostgreSQL + Prisma / Claude API',
      points: [
        'Designed, built and launched solo: sprints, live Kanban boards, time tracking and analytics, on a multi-tenant Org/Team/Project permission model with Zod-validated, JWT-protected APIs.',
        'Shipped an AI assistant that turns plain-language or voice commands into board actions, asks for approval and only acts within the user’s role.',
      ],
    },
  ],
  skills: [
    { label: 'Frontend', items: 'React, Next.js, TypeScript, JavaScript, Vue.js, Nuxt.js, TanStack, Pinia, Tailwind CSS, shadcn/ui' },
    { label: 'Backend & data', items: 'Node.js, Express, Bun, REST, Socket.IO, Zod, JWT, PostgreSQL, Azure SQL, MySQL, MongoDB, Prisma, TypeORM' },
    { label: 'Cloud & DevOps', items: 'Azure (Container Apps, API Management, DevOps CI/CD), Vercel, Git' },
    { label: 'Architecture & AI', items: 'Multi-tenant and config-driven systems, RBAC, real-time systems, SAP S/4HANA. AI-first development with Cursor and LLM agents, Claude API' },
  ],
};

// Real projects that are not on the default résumé. The model may swap one in when the role calls for it.
export const extraProjects: Cv['projects'] = [
  {
    name: 'QluePrint', tagline: 'Local-first desktop workspace for databases', link: 'github.com/u-ninja/qlueprint',
    stack: 'Tauri / Rust / React / TypeScript / Monaco / sqlx',
    points: [
      'Desktop app that connects to PostgreSQL, MySQL, MariaDB, SQL Server and SQLite, with a schema-aware SQL editor and a fast virtualized results grid.',
      'Edits are staged, undoable and saved in one transaction; credentials live in the system keychain and every statement is recorded in a tamper-evident local audit log.',
    ],
  },
  {
    name: 'NinjaTrade', tagline: 'Personal paper-trading platform', link: 'private',
    stack: 'Python / FastAPI / pandas / React 19 / ECharts / systemd / Caddy / Cloudflare Access',
    points: [
      'A daily job fetches market prices, invests a monthly amount on paper using backtested rules and sends a Telegram summary.',
      'FastAPI and React app showing portfolio, backtests and live server health, on a hardened VM behind Cloudflare Access and Tailscale.',
    ],
  },
  {
    name: 'Blacksite', tagline: 'Tactical top-down shooter prototype', link: 'private',
    stack: 'Godot 4 / GDScript',
    points: [
      'Round-based game with ray-cast line of sight, layered collision physics and an enemy AI state machine.',
      'Gameplay rules covered by headless tests that exit with a failure when something breaks.',
    ],
  },
];
