import { SceneHead } from './SceneHead';

const jobs = [
  {
    ref: 'HEAD', company: 'Digitrell', where: 'Kochi, India',
    role: 'Senior Software Engineer', period: 'Jan 2026 – Present',
    note: 'Promoted from Software Engineer (Apr 2025 – Dec 2025) after 9 months.',
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
    ref: 'HEAD~1', company: 'FPLE Technologies', where: 'Bengaluru, India',
    role: 'Frontend Developer', period: 'Jan 2024 – Mar 2025',
    points: [
      'Improved Core Web Vitals and initial page load by 30% by moving key pages to server-side and static rendering in Nuxt.js.',
      'Built a reusable Vue.js component library with centralized Pinia state, speeding up delivery and keeping the UI consistent across products.',
    ],
  },
  {
    ref: 'HEAD~2', company: 'Scipy Technologies', where: 'Thiruvananthapuram, India',
    role: 'MERN Stack Developer', period: 'Jan 2023 – Jan 2024',
    points: ['Migrated legacy multi-page workflows to React SPAs and built modular REST APIs in Node.js, TypeScript and MongoDB.'],
  },
  {
    ref: 'init', company: 'Vidya Academy of Science and Technology', where: 'Kerala, India',
    role: 'B.Tech, Computer Science', period: '2019 – 2023',
    points: ['CGPA 8.6 / 10.'],
  },
];

export function Experience() {
  return (
    <section id="experience" data-shape="dust" data-alpha="0.2" className="relative px-6 py-24 md:px-10 md:py-36">
      <div className="mx-auto max-w-6xl">
        <SceneHead fn="git log --career" title="Experience" />
        <ol className="mt-14 md:mt-20">
          {jobs.map((job, i) => (
            <li key={job.company} className="relative grid gap-x-10 pb-12 pl-8 last:pb-0 md:grid-cols-[13rem_1fr] md:pl-10">
              {/* commit graph */}
              {i < jobs.length - 1 && <span aria-hidden="true" className="absolute bottom-0 left-[5px] top-3 w-px bg-line" />}
              <span aria-hidden="true" className={`absolute left-0 top-2 h-[11px] w-[11px] border ${i === 0 ? 'border-signal bg-signal' : 'border-mute bg-ink'}`} />
              <div className="mb-3 font-mono text-xs leading-6 text-mute">
                <p className={i === 0 ? 'text-signal-soft' : ''}>{job.ref}</p>
                <p>{job.period}</p>
              </div>
              <details open={i === 0} className="group">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-4 [&::-webkit-details-marker]:hidden">
                  <span>
                    <span className="block text-2xl font-semibold md:text-3xl">{job.role}</span>
                    <span className="mt-1 block text-mute">{job.company}, {job.where}</span>
                  </span>
                  <span aria-hidden="true" className="mt-2 font-mono text-signal-soft group-open:hidden">+</span>
                  <span aria-hidden="true" className="mt-2 hidden font-mono text-signal-soft group-open:inline">−</span>
                </summary>
                {job.note && <p className="mt-4 font-mono text-xs text-signal-soft">{job.note}</p>}
                <ul className="mt-4 max-w-2xl space-y-3">
                  {job.points.map((p) => (
                    <li key={p} className="border-l border-line pl-4 leading-relaxed text-mute">{p}</li>
                  ))}
                </ul>
              </details>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
