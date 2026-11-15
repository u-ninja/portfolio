'use client';
import { useState } from 'react';
import { Flow, Window } from './Window';

const columns = ['To do', 'In progress', 'Done'];
const cards = ['Auth flow', 'Onboarding', 'Kanban board', 'Search', 'API setup', 'DB schema'];
// column of each card, per story stage
const presets = [
  [0, 0, 1, 1, 2, 2],
  [1, 0, 2, 1, 2, 2],
  [1, 0, 2, 1, 2, 2],
  [1, 0, 2, 2, 2, 2],
];
const roles = ['Admin', 'Member', 'Viewer'];

export function TeemeDemo({ stage }: { stage: number }) {
  const [edit, setEdit] = useState<{ stage: number; at: number[] } | null>(null);
  const [role, setRole] = useState('Member');
  const [blocked, setBlocked] = useState(false);
  const at = edit?.stage === stage ? edit.at : presets[stage]; // manual moves last until the story moves on
  const readOnly = stage === 3 && role === 'Viewer';

  const move = (i: number, to = (at[i] + 1) % 3) => {
    setBlocked(readOnly);
    if (readOnly) return;
    setEdit({ stage, at: at.map((c, j) => (j === i ? to : c)) });
  };

  return (
    <Window title="teeme.org / board" note="click a card to move it">
      <div className="grid grid-cols-3 gap-3 font-mono text-[11px] text-mute">
        {columns.map((c, i) => (
          <div key={c} className="border-b border-line pb-2">
            {c} <span className="text-signal-soft">{at.filter((x) => x === i).length}</span>
          </div>
        ))}
      </div>
      <div className="relative mt-3 h-[216px]">
        {cards.map((title, i) => {
          const row = at.slice(0, i).filter((c) => c === at[i]).length;
          return (
            <button
              key={title}
              type="button"
              onClick={() => move(i)}
              aria-label={`${title}, in ${columns[at[i]]}. Move to next column`}
              className="absolute left-0 top-0 w-[calc((100%-1.5rem)/3)] cursor-pointer border border-line bg-ink px-3 py-2.5 text-left text-sm transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-signal-soft"
              style={{ transform: `translate(calc(${at[i]} * (100% + 0.75rem)), ${row * 52}px)` }}
            >
              {title}
            </button>
          );
        })}
      </div>

      <div key={stage} className="absolute inset-x-4 bottom-4 border-t border-line pt-3 font-mono text-xs">
        {stage === 0 && <p className="text-mute">Sprints, live boards, time tracking and analytics.</p>}
        {stage === 1 && <p className="row-in text-mute">Two cards just moved. Everyone on the board sees it live.</p>}
        {stage === 2 && (
          <>
            <p>
              <span className="text-signal-soft">assistant › </span>
              <span className="typing" style={{ '--n': 21 } as React.CSSProperties}>move Search to Done.</span>
            </p>
            <p className="row-in mt-2 flex flex-wrap items-center gap-3" style={{ '--at': '1.7s' } as React.CSSProperties}>
              {at[3] === 2 ? (
                <span className="text-signal-soft">Done. Moved as a Member, within that role.</span>
              ) : (
                <>
                  <span className="text-mute">Move “Search” to Done?</span>
                  <button type="button" onClick={() => move(3, 2)} className="cursor-pointer bg-signal px-3 py-1 text-white">
                    Approve
                  </button>
                </>
              )}
            </p>
          </>
        )}
        {stage === 3 && (
          <div className="space-y-3">
            <Flow steps={['Org', 'Team', 'Project', 'Role']} />
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-mute">Act as</span>
              {roles.map((r) => (
                <button
                  key={r}
                  type="button"
                  aria-pressed={role === r}
                  onClick={() => { setRole(r); setBlocked(false); }}
                  className={`cursor-pointer border px-2.5 py-1 ${role === r ? 'border-signal bg-signal text-white' : 'border-line text-mute hover:text-paper'}`}
                >
                  {r}
                </button>
              ))}
              <span role="status" className="text-signal-soft">{blocked ? 'Viewers can’t move cards.' : ''}</span>
            </div>
          </div>
        )}
      </div>
    </Window>
  );
}
