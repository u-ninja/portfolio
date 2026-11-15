'use client';
import { useState } from 'react';
import { Flow, Window } from './Window';

// Config shape simplified for the demo. The second file is a made-up client.
const configs = [
  {
    file: 'ftr-steel.json', brand: 'FTR Steel', accent: '#f59e0b',
    modules: ['Job orders', 'Workforce', 'Inventory'],
    roles: { Admin: [0, 1, 2], Supervisor: [0, 1], Storekeeper: [2] } as Record<string, number[]>,
  },
  {
    file: 'your-company.json', brand: 'Your Company', accent: '#2dd4bf',
    modules: ['Orders', 'Fleet', 'Billing', 'Reports'],
    roles: { Admin: [0, 1, 2, 3], Dispatcher: [0, 1], Accountant: [2, 3] } as Record<string, number[]>,
  },
];
const stageConfig = [0, 1, 0, 1];

export function ErpDemo({ stage }: { stage: number }) {
  const [pick, setPick] = useState<{ stage: number; cfg: number } | null>(null);
  const [roleIdx, setRoleIdx] = useState(0);
  const [moduleIdx, setModuleIdx] = useState(0);
  const ci = pick?.stage === stage ? pick.cfg : stageConfig[stage];
  const cfg = configs[ci];
  const roleNames = Object.keys(cfg.roles);
  const role = roleNames[stage === 2 ? Math.min(roleIdx, roleNames.length - 1) : 0];
  const allowed = cfg.roles[role];
  const open = allowed.includes(moduleIdx) ? moduleIdx : allowed[0];

  return (
    <Window title="one codebase" note="switch the config file">
      <div className="mb-3 flex gap-1.5 whitespace-nowrap font-mono text-[10px] sm:gap-2 sm:text-xs">
        {configs.map((c, i) => (
          <button
            key={c.file}
            type="button"
            aria-pressed={ci === i}
            onClick={() => setPick({ stage, cfg: i })}
            className={`cursor-pointer border px-2.5 py-1 ${ci === i ? 'border-paper text-paper' : 'border-line text-mute hover:text-paper'}`}
          >
            {c.file}
          </button>
        ))}
      </div>

      <div className="grid h-[calc(100%-2.5rem)] gap-3 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="hidden overflow-hidden border border-line bg-ink p-3 sm:block">
          {stage === 3 ? (
            <Flow vertical steps={[cfg.file, 'modules · roles · workflows · theme', 'the same build', `${cfg.brand}, live in about 5 minutes`]} />
          ) : (
            <pre key={ci} className="row-in font-mono text-[11px] leading-5 text-mute">
              {'{\n  "brand": '}<span className="text-paper">&quot;{cfg.brand}&quot;</span>
              {',\n  "theme": { "accent": '}<span style={{ color: cfg.accent }}>&quot;{cfg.accent}&quot;</span>
              {' },\n  "modules": [\n'}
              {cfg.modules.map((m) => <span key={m} className="text-paper">{`    "${m}",\n`}</span>)}
              {'  ],\n  "roles": {\n'}
              {roleNames.map((r) => (
                <span key={r} className={stage === 2 && r === role ? 'text-signal-soft' : ''}>{`    "${r}": [${cfg.roles[r].join(', ')}],\n`}</span>
              ))}
              {'  }\n}'}
            </pre>
          )}
        </div>

        {/* the "product": everything below is derived from the config above */}
        <div className="flex min-h-0 flex-col border border-line bg-ink">
          <div className="flex items-center gap-2 border-b border-line px-3 py-2 text-sm font-semibold">
            <span className="h-3 w-3 transition-colors duration-500" style={{ background: cfg.accent }} />
            {cfg.brand}
            <span className="ml-auto font-mono text-[11px] font-normal text-mute">{role}</span>
          </div>
          <div className="flex min-h-0 flex-1 overflow-hidden">
            <ul className="w-[42%] shrink-0 border-r border-line p-2 text-xs">
              {cfg.modules.map((m, i) => allowed.includes(i) && (
                <li key={m} className="row-in">
                  <button
                    type="button"
                    onClick={() => setModuleIdx(i)}
                    className="w-full cursor-pointer border-l-2 px-2 py-1.5 text-left transition-colors duration-300"
                    style={open === i ? { borderColor: cfg.accent, color: cfg.accent } : { borderColor: 'transparent', color: 'var(--color-mute)' }}
                  >
                    {m}
                  </button>
                </li>
              ))}
            </ul>
            <div className="flex-1 p-3">
              <p className="mb-3 text-sm">{cfg.modules[open]}</p>
              {[70, 92, 55, 80].map((w, i) => (
                <div key={i} className="mb-2 h-2 bg-white/10" style={{ width: `${w}%` }} />
              ))}
              <span className="mt-2 inline-block px-2 py-1 font-mono text-[11px] text-black transition-colors duration-500" style={{ background: cfg.accent }}>
                + New
              </span>
            </div>
          </div>
          {stage === 2 && (
            <div className="flex flex-wrap items-center gap-1.5 border-t border-line p-2 font-mono text-[10px] sm:gap-2 sm:text-[11px]">
              <span className="text-mute">Sign in as</span>
              {roleNames.map((r, i) => (
                <button
                  key={r}
                  type="button"
                  aria-pressed={role === r}
                  onClick={() => setRoleIdx(i)}
                  className={`cursor-pointer border px-2 py-0.5 ${role === r ? 'border-signal bg-signal text-white' : 'border-line text-mute hover:text-paper'}`}
                >
                  {r}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </Window>
  );
}
