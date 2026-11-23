export type Id = 'frontend' | 'backend' | 'realtime' | 'data' | 'cloud' | 'ai';

export const nodes: Record<Id, { label: string; x: number; y: number; what: string; tech: string[]; hard: string; projects: string[] }> = {
  frontend: {
    label: 'Frontend', x: 90, y: 240,
    what: 'Interfaces people work in all day: boards, dashboards and admin tools that stay fast while the data underneath keeps changing.',
    tech: ['React', 'Next.js', 'TypeScript', 'Vue.js', 'Nuxt.js', 'TanStack', 'Pinia', 'Tailwind CSS'],
    hard: 'Cut initial page load by 30% by moving key pages to server-side and static rendering.',
    projects: ['Teeme', 'Config-driven ERP'],
  },
  backend: {
    label: 'Backend', x: 300, y: 240,
    what: 'APIs and services with validated input, role checks and transactions that hold up under concurrent use.',
    tech: ['Node.js', 'Express', 'Bun', 'REST', 'Zod', 'JWT'],
    hard: 'A transaction-safe ledger pipeline that posts cashflow automatically and keeps a complete audit trail.',
    projects: ['Teeme', 'Warehouse platform'],
  },
  realtime: {
    label: 'Real-time & integrations', x: 215, y: 70,
    what: 'Keeping separate systems in agreement while operations are live on the warehouse floor.',
    tech: ['Socket.IO', 'SAP S/4HANA', 'SCALE WMS'],
    hard: 'Two-way sync of customers, carriers, buildings and appointments with a second warehouse’s WMS, with per-facility access.',
    projects: ['Warehouse platform'],
  },
  data: {
    label: 'Databases', x: 300, y: 410,
    what: 'Schemas, queries and permission models that stay correct as the product grows.',
    tech: ['PostgreSQL', 'Azure SQL', 'MySQL', 'MongoDB', 'Prisma', 'TypeORM'],
    hard: '40% more data-entry throughput from rewriting nested legacy queries and redesigning batch processing.',
    projects: ['QluePrint', 'Teeme'],
  },
  cloud: {
    label: 'Cloud & delivery', x: 505, y: 335,
    what: 'Shipping many times a week without breaking production.',
    tech: ['Azure Container Apps', 'API Management', 'Azure DevOps CI/CD', 'Vercel'],
    hard: 'About 29 releases a week kept stable with hotfix branches and revision-based deploys.',
    projects: ['Warehouse platform'],
  },
  ai: {
    label: 'AI integration', x: 500, y: 110,
    what: 'AI as a product feature, and as the way I work: fast, but owning every line that ships.',
    tech: ['Claude API', 'LLM agents', 'Cursor'],
    hard: 'An assistant that turns plain-language or voice commands into board actions, asks for approval and only acts within the user’s role.',
    projects: ['Teeme'],
  },
};

export const edges: [Id, Id][] = [
  ['frontend', 'backend'], ['frontend', 'realtime'], ['backend', 'realtime'], ['backend', 'data'],
  ['backend', 'cloud'], ['backend', 'ai'], ['data', 'cloud'],
];

