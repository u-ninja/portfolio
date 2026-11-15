'use client';
import { useState } from 'react';
import { Flow, Window } from './Window';

const sql = ['SELECT name, city, total', 'FROM customers', 'JOIN orders USING (customer_id)', 'ORDER BY total DESC LIMIT 4;'];
// made-up demo data
const rows = [
  ['Asha Menon', 'Kochi', '84,200'],
  ['Rahul Nair', 'Bengaluru', '61,750'],
  ['Lena Fischer', 'Berlin', '48,900'],
  ['Omar Khalid', 'Dubai', '37,300'],
];
const log = ['SELECT … FROM customers JOIN orders', 'UPDATE customers SET city = …', 'DELETE FROM customers WHERE id = …', 'INSERT INTO customers …', 'COMMIT'];
const css = (v: Record<string, string | number>) => v as React.CSSProperties;

export function QlueDemo({ stage }: { stage: number }) {
  const [run, setRun] = useState(0);
  const [saved, setSaved] = useState(-1);
  const typed = sql.reduce<number[]>((acc, l, i) => [...acc, (acc[i - 1] ?? 0.3) + (i ? sql[i - 1].length * 0.055 : 0)], []);
  const done = typed[sql.length - 1] + sql[sql.length - 1].length * 0.055 + 0.2;
  const edited = stage === 1;
  const editing = edited && saved !== run; // staged but not yet saved

  return (
    <Window title="QluePrint / demo.sqlite" note="demo data">
      {stage === 3 ? (
        <div className="space-y-4">
          <Flow vertical steps={['React + Monaco editor', 'Tauri commands', 'Rust core: sqlx, tiberius', 'PostgreSQL · MySQL · MariaDB · SQL Server · SQLite']} />
          <p className="font-mono text-xs leading-5 text-mute">Passwords go to the system keychain, never to plain files.</p>
        </div>
      ) : stage === 2 ? (
        <ol className="space-y-2 font-mono text-xs">
          {log.map((l, i) => (
            <li key={l} className="row-in flex gap-3 border-b border-line pb-2" style={css({ '--at': `${i * 0.25}s` })}>
              <span className="text-signal-soft">{String(i + 1).padStart(3, '0')}</span>
              <span className="truncate">{l}</span>
            </li>
          ))}
          <li className="row-in pt-2 text-mute" style={css({ '--at': '1.4s' })}>
            Every statement the app ran, kept on your machine in a tamper-evident log.
          </li>
        </ol>
      ) : (
        <div key={`${stage}-${run}`} className="flex h-full flex-col gap-3">
          <div className="border border-line bg-ink p-3 font-mono text-xs leading-6">
            {sql.map((l, i) => (
              <div key={l}>
                <span className="mr-3 text-mute">{i + 1}</span>
                <span className="typing text-paper" style={css({ '--n': l.length, '--at': `${stage === 0 ? typed[i] : 0}s` })}>{l}</span>
              </div>
            ))}
          </div>
          <table className="w-full text-left font-mono text-xs">
            <thead className="text-mute">
              <tr>{['name', 'city', 'total'].map((h) => <th key={h} className="border-b border-line py-1.5 font-normal">{h}</th>)}</tr>
            </thead>
            <tbody>
              {rows.map((r, i) => !(edited && !editing && i === 3) && (
                <tr key={r[0]} className="row-in" style={css({ '--at': `${stage === 0 ? done + i * 0.12 : 0}s` })}>
                  {r.map((c, j) => (
                    <td
                      key={j}
                      className={`border-b border-line py-1.5 ${editing && i === 3 ? 'text-mute line-through' : ''} ${editing && i === 1 && j === 1 ? 'bg-signal/25 text-white' : ''}`}
                    >
                      {edited && i === 1 && j === 1 ? 'Kochi' : c}
                    </td>
                  ))}
                </tr>
              ))}
              {edited && (
                <tr className={`row-in ${editing ? 'text-signal-soft' : ''}`}>
                  <td className="border-b border-line py-1.5">{editing ? '+ ' : ''}Mei Tanaka</td>
                  <td className="border-b border-line">Osaka</td>
                  <td className="border-b border-line">0</td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="mt-auto flex flex-wrap items-center gap-3 font-mono text-xs">
            {stage === 0 ? (
              <button type="button" onClick={() => setRun(run + 1)} className="cursor-pointer bg-signal px-3 py-1 text-white">Run again</button>
            ) : editing ? (
              <>
                <span className="text-mute">3 changes staged</span>
                <button type="button" onClick={() => setSaved(run)} className="cursor-pointer bg-signal px-3 py-1 text-white">Save in one transaction</button>
              </>
            ) : (
              <>
                <span className="text-signal-soft">Saved. 1 transaction, 3 changes.</span>
                <button type="button" onClick={() => setRun(run + 1)} className="cursor-pointer border border-line px-3 py-1 text-mute hover:text-paper">Edit again</button>
              </>
            )}
          </div>
        </div>
      )}
    </Window>
  );
}
