export function SceneHead({ fn, title, children }: { fn: string; title: string; children?: React.ReactNode }) {
  return (
    <header className="max-w-3xl">
      <p className="mb-4 font-mono text-sm text-signal-soft">{fn}</p>
      <h2 className="display text-[clamp(2.6rem,7vw,6rem)]">{title}</h2>
      {children && <p className="mt-6 max-w-xl text-lg leading-relaxed text-mute">{children}</p>}
    </header>
  );
}
