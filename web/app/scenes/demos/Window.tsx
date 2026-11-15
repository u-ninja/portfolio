export function Window({ title, note, children }: { title: string; note?: string; children: React.ReactNode }) {
  return (
    <div className="flex h-full flex-col border border-line bg-panel">
      <div className="flex items-center justify-between gap-4 border-b border-line px-4 py-2.5 font-mono text-xs text-mute">
        <span className="truncate text-paper">{title}</span>
        {note && <span className="truncate">{note}</span>}
      </div>
      <div className="relative min-h-0 flex-1 overflow-hidden p-4">{children}</div>
    </div>
  );
}

/** A row of flowchart boxes joined by arrows, for the "how it fits together" stage of a demo. */
export function Flow({ steps, vertical }: { steps: string[]; vertical?: boolean }) {
  return (
    <ol className={`flex ${vertical ? 'flex-col' : 'flex-wrap'} items-stretch gap-2 font-mono text-xs`}>
      {steps.map((s, i) => (
        <li key={s} className={`row-in flex ${vertical ? 'flex-col' : ''} items-center gap-2`} style={{ '--at': `${i * 0.15}s` } as React.CSSProperties}>
          <span className="w-full border border-line bg-ink px-3 py-2 text-center text-paper">{s}</span>
          {i < steps.length - 1 && <span aria-hidden="true" className="text-signal-soft">{vertical ? '↓' : '→'}</span>}
        </li>
      ))}
    </ol>
  );
}
