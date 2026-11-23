const stats = [
  ['30%', 'faster initial page load, by moving key pages to server-side and static rendering'],
  ['40%', 'more data-entry throughput, from rewriting nested legacy queries'],
  ['29', 'production releases a week, kept stable with hotfix branches and revision-based deploys'],
];

export function Numbers() {
  return (
    <section aria-label="Results" className="px-6 py-16 md:px-10 md:py-24">
      <dl className="mx-auto grid max-w-6xl gap-12 border-t border-line pt-12 md:grid-cols-3">
        {stats.map(([n, t]) => (
          <div key={n} className="reveal">
            <dt className="display text-[clamp(4rem,9vw,8rem)]">{n}</dt>
            <dd className="mt-3 max-w-xs text-mute">{t}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
