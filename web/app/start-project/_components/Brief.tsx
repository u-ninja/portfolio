'use client';
import { useState, type FormEvent } from 'react';
import { Flow } from '../../scenes/demos/Window';
import { WHATSAPP_URL, WhatsAppIcon } from '../../components/WhatsApp';

const EMAIL = 'hello@teeme.org';
const types: [string, string][] = [
  ['Web app', 'A product with accounts and logic'],
  ['Website', 'A marketing or portfolio site'],
  ['Dashboard / ERP', 'Internal tools and live data'],
  ['Something else', 'Tell me in the details'],
];
const features = ['Accounts & roles', 'Payments', 'Real-time updates', 'AI assistant', 'Integrations & APIs', 'Admin dashboard', 'Reports & exports', 'Notifications'];
const styles: [string, string][] = [
  ['Minimal', 'Quiet, light, lots of air'],
  ['Bold', 'Dark, loud, heavy type'],
  ['Playful', 'Tinted, friendly, a bit cheeky'],
  ['Corporate', 'Clean, trusted, structured'],
];
const colors: [string, string][] = [['Blue', '#2f6bff'], ['Emerald', '#10b981'], ['Amber', '#f59e0b'], ['Rose', '#f43f5e'], ['Mono', '#e5e7eb']];
const fonts: [string, string][] = [['Modern sans', 'var(--font-bricolage), sans-serif'], ['Editorial serif', 'Georgia, serif'], ['Technical mono', 'var(--font-jetbrains), monospace']];
const corners: [string, string][] = [['Sharp', '0px'], ['Soft', '10px'], ['Round', '24px']];
const timelines = ['ASAP', '1–2 months', '3+ months', 'Flexible'];
const budgets = ['< $2k', '$2k – $5k', '$5k – $15k', '$15k+', 'Not sure yet'];
const steps = [
  ['Project', 'What are we building?', 'So the first reply sounds like it was written for you.'],
  ['Needs', 'What does it need to do?', 'Pick everything that applies. Skipping is fine.'],
  ['Style', 'How should it feel?', 'The preview on the right changes as you choose.'],
  ['Colour & type', 'Colour and typeface', 'A direction to start from, not a final decision.'],
  ['Shape', 'Sharp or soft?', 'The corner radius shows up everywhere: cards, buttons, inputs.'],
  ['Timing', 'Timeline and budget?', 'Rough is fine. It only helps me plan my reply.'],
  ['Contact', 'Where do I send the reply?', 'I usually answer within two working days.'],
] as const;
const LAST = steps.length - 1;
const headlines: Record<string, string> = {
  'Web app': 'Your product, ready to use.',
  Website: 'Say what you do, loud and clear.',
  'Dashboard / ERP': 'Every number, live.',
  'Something else': 'Your idea, built properly.',
};

const label = 'block font-mono text-xs text-mute';
const input =
  'mt-2 w-full font-display border-b border-line bg-transparent py-3 text-lg text-paper outline-none transition-colors duration-200 placeholder:text-mute/60 focus:border-signal-soft';

/** A big option card with a radio/checkbox dot. */
function Card({ active, onClick, title, sub, multi, children, style }: { active: boolean; onClick: () => void; title: string; sub?: string; multi?: boolean; children?: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <button
      type="button"
      role={multi ? 'checkbox' : 'radio'}
      aria-checked={active}
      onClick={onClick}
      style={style}
      className={`flex cursor-pointer items-start justify-between gap-3 rounded-2xl border p-4 text-left transition-colors duration-200 ${active ? 'border-signal bg-signal/10' : 'border-line hover:border-paper/60'}`}
    >
      <span>
        <span className="block text-base font-medium text-paper">{title}</span>
        {sub && <span className="mt-1 block text-sm text-mute">{sub}</span>}
        {children}
      </span>
      <span aria-hidden="true" className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border transition-colors ${active ? 'border-signal bg-signal' : 'border-line'}`}>
        {active && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
      </span>
    </button>
  );
}

export function Brief() {
  const [step, setStep] = useState(0);
  const [reached, setReached] = useState(0);
  const [mobile, setMobile] = useState(false);
  const [f, setF] = useState({ name: '', email: '', type: '', features: [] as string[], style: '', color: '', font: '', corners: '', timeline: '', budget: '', details: '' });
  const [sent, setSent] = useState(false);
  const set = <K extends keyof typeof f>(k: K) => (v: (typeof f)[K]) => setF((p) => ({ ...p, [k]: v }));
  const one = (k: 'type' | 'style' | 'color' | 'font' | 'corners' | 'timeline' | 'budget', v: string) => set(k)(f[k] === v ? '' : v);
  const toggle = (o: string) => set('features')(f.features.includes(o) ? f.features.filter((x) => x !== o) : [...f.features, o]);
  const go = (n: number) => {
    setStep(n);
    setReached((r) => Math.max(r, n));
  };

  // Preview values; unchosen options fall back to sensible defaults.
  const dark = f.style === 'Bold';
  const mono = f.color === 'Mono';
  const hex = colors.find(([n]) => n === f.color)?.[1] ?? '#2f6bff';
  const accent = mono ? (dark ? '#e5e7eb' : '#111111') : hex;
  const accentFg = mono ? (dark ? '#111111' : '#ffffff') : '#ffffff';
  const font = fonts.find(([n]) => n === f.font)?.[1] ?? fonts[0][1];
  const radius = corners.find(([n]) => n === f.corners)?.[1] ?? '10px';
  const pages = {
    Bold: { bg: '#0b0d14', fg: '#ffffff', head: 'font-black uppercase' },
    Playful: { bg: `color-mix(in srgb, ${hex} 16%, #ffffff)`, fg: '#111111', head: 'font-bold italic' },
    Corporate: { bg: '#ffffff', fg: '#0f172a', head: 'font-semibold' },
    Minimal: { bg: '#f6f6f3', fg: '#111111', head: 'font-light' },
  } as const;
  const page = pages[(f.style || 'Minimal') as keyof typeof pages];
  const company = f.name.trim() || 'Your company';
  const slug = f.name.toLowerCase().replace(/[^a-z0-9]+/g, '') || 'yourcompany';

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (step < LAST) return go(step + 1);
    const subject = `New project${f.type ? ` — ${f.type}` : ''} from ${f.email}`;
    const look = [f.style, f.color, f.font, f.corners && `${f.corners} corners`].filter(Boolean).join(' / ');
    const body = [
      f.name ? `Company / project: ${f.name}` : null,
      `Email: ${f.email}`,
      f.type ? `Project type: ${f.type}` : null,
      f.features.length ? `Needs: ${f.features.join(', ')}` : null,
      look ? `Look: ${look}` : null,
      f.timeline ? `Timeline: ${f.timeline}` : null,
      f.budget ? `Budget: ${f.budget}` : null,
      '',
      f.details,
    ]
      .filter((l) => l !== null)
      .join('\n');
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  }

  return (
    <section id="project-form" className="px-6 pb-24 md:px-10 md:pb-32">
      <div className="mx-auto max-w-6xl">
        <nav aria-label="Steps" className="relative mb-8 overflow-x-auto pb-4 [scrollbar-width:none]">
          <span aria-hidden="true" className="absolute bottom-3 left-0 h-px w-full bg-line" />
          <span aria-hidden="true" className="absolute bottom-3 left-0 h-px bg-signal transition-[width] duration-700 ease-out" style={{ width: `${((step + 1) / steps.length) * 100}%` }} />
          <ol className="flex min-w-max gap-2">
            {steps.map(([tab], i) => (
              <li key={tab}>
                <button
                  type="button"
                  disabled={i > reached}
                  aria-current={i === step ? 'step' : undefined}
                  onClick={() => setStep(i)}
                  className={`cursor-pointer rounded-full border px-4 py-1.5 font-mono text-xs transition-colors duration-200 disabled:cursor-default ${
                    i === step ? 'border-paper bg-transparent text-paper' : i <= reached ? 'border-transparent text-mute hover:text-paper' : 'border-transparent text-mute/40'
                  }`}
                >
                  <span className="mr-2 opacity-60">{String(i + 1).padStart(2, '0')}</span>
                  {tab}
                </button>
              </li>
            ))}
          </ol>
        </nav>

        <div className="grid gap-8 lg:grid-cols-[1.05fr_1fr] lg:gap-10">
          <form onSubmit={onSubmit} className="rounded-3xl border border-line bg-panel/60 p-6 md:p-10">
            <div key={step} className="step-in min-h-[24rem]">
              <h2 aria-live="polite" className="display text-[clamp(2rem,4.4vw,3.4rem)]">{steps[step][1]}</h2>
              <p className="mb-8 mt-3 text-mute">{steps[step][2]}</p>

              {step === 0 && (
                <div className="space-y-8">
                  <label className={label}>
                    company or project name
                    <input autoComplete="organization" value={f.name} onChange={(e) => set('name')(e.target.value)} placeholder="e.g. Café Lindengrün" className={input} />
                  </label>
                  <div role="radiogroup" aria-label="Project type" className="grid gap-3 sm:grid-cols-2">
                    {types.map(([t, d]) => <Card key={t} active={f.type === t} onClick={() => one('type', t)} title={t} sub={d} />)}
                  </div>
                </div>
              )}

              {step === 1 && (
                <div role="group" aria-label="Needs" className="grid gap-3 sm:grid-cols-2">
                  {features.map((o) => <Card multi key={o} active={f.features.includes(o)} onClick={() => toggle(o)} title={o} />)}
                </div>
              )}

              {step === 2 && (
                <div role="radiogroup" aria-label="Style" className="grid gap-3 sm:grid-cols-2">
                  {styles.map(([n, d]) => <Card key={n} active={f.style === n} onClick={() => one('style', n)} title={n} sub={d} />)}
                </div>
              )}

              {step === 3 && (
                <div className="space-y-8">
                  <div>
                    <span className={label}>colour</span>
                    <div role="radiogroup" aria-label="Colour" className="mt-3 flex gap-3">
                      {colors.map(([n, c]) => (
                        <button key={n} type="button" role="radio" aria-checked={f.color === n} aria-label={n} title={n} onClick={() => one('color', n)} style={{ background: c }}
                          className={`h-10 w-10 cursor-pointer rounded-full border-2 transition-transform duration-200 ${f.color === n ? 'scale-110 border-paper' : 'border-transparent hover:scale-110'}`} />
                      ))}
                    </div>
                  </div>
                  <div role="radiogroup" aria-label="Typeface" className="grid gap-3">
                    {fonts.map(([n, ff]) => (
                      <Card key={n} active={f.font === n} onClick={() => one('font', n)} title={n} style={{ fontFamily: ff }}>
                        <span className="mt-1 block text-2xl text-paper">Aa — Build it properly.</span>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {step === 4 && (
                <div role="radiogroup" aria-label="Corners" className="grid gap-3 sm:grid-cols-3">
                  {corners.map(([n, r]) => (
                    <Card key={n} active={f.corners === n} onClick={() => one('corners', n)} title={n}>
                      <span aria-hidden="true" className="mt-4 block h-14 w-20 border-2 border-signal-soft" style={{ borderRadius: r }} />
                    </Card>
                  ))}
                </div>
              )}

              {step === 5 && (
                <div className="space-y-8">
                  <div role="radiogroup" aria-label="Timeline" className="grid gap-3 sm:grid-cols-2">
                    {timelines.map((t) => <Card key={t} active={f.timeline === t} onClick={() => one('timeline', t)} title={t} />)}
                  </div>
                  <div role="radiogroup" aria-label="Budget" className="grid gap-3 sm:grid-cols-3">
                    {budgets.map((b) => <Card key={b} active={f.budget === b} onClick={() => one('budget', b)} title={b} />)}
                  </div>
                </div>
              )}

              {step === 6 && (
                <div className="space-y-10">
                  <label className={label}>email<input type="email" required autoComplete="email" value={f.email} onChange={(e) => set('email')(e.target.value)} placeholder="you@company.com" className={input} /></label>
                  <label className={label}>
                    details
                    <textarea required rows={4} value={f.details} onChange={(e) => set('details')(e.target.value)} placeholder="Goals, deadlines, links to anything that exists today" className={`${input} resize-y`} />
                  </label>
                </div>
              )}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              {step > 0 && <button type="button" onClick={() => go(step - 1)} className="btn cursor-pointer rounded-full">Back</button>}
              <button type="submit" className="btn btn-solid cursor-pointer rounded-full">{step < LAST ? 'Continue' : 'Send project brief'}</button>
              {step > 0 && step < LAST && <button type="button" onClick={() => go(step + 1)} className="cursor-pointer font-mono text-xs text-mute underline decoration-line underline-offset-4 hover:text-paper">Skip</button>}
              {sent && (
                <p role="status" className="text-sm text-mute">
                  Email app didn’t open? <a href={`mailto:${EMAIL}`} className="text-signal-soft underline underline-offset-4">Email me directly</a>.
                </p>
              )}
            </div>
          </form>

          <aside aria-label="Live preview" className="lg:sticky lg:top-28 lg:self-start">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-mono text-xs text-mute">LIVE PREVIEW</span>
              <div className="flex rounded-full bg-panel p-1 font-mono text-xs" role="group" aria-label="Preview size">
                {([['Desktop', false], ['Mobile', true]] as const).map(([n, m]) => (
                  <button key={n} type="button" aria-pressed={mobile === m} onClick={() => setMobile(m)} className={`cursor-pointer rounded-full px-4 py-1.5 transition-colors ${mobile === m ? 'bg-paper text-ink' : 'text-mute hover:text-paper'}`}>
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <div aria-hidden="true" className={`mx-auto overflow-hidden rounded-2xl border border-line bg-[#1a1a1a] transition-[max-width] duration-500 ease-out ${mobile ? 'max-w-[15rem]' : 'max-w-full'}`}>
              <div className="flex items-center gap-1.5 px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" /><span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" /><span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                <span className="mx-auto max-w-[60%] truncate rounded-full bg-black/40 px-3 py-0.5 font-mono text-[10px] text-mute">{slug}.com</span>
              </div>
              <div className="px-4 pb-4 transition-colors duration-500" style={{ background: page.bg, color: page.fg, fontFamily: font }}>
                <div className="flex items-center justify-between py-3 text-[11px]">
                  <span className="truncate font-semibold">{company}</span>
                  {!mobile && <span className="flex gap-3 opacity-60"><span>Work</span><span>About</span><span>Contact</span></span>}
                  <span className="px-2.5 py-1 transition-all duration-500" style={{ background: accent, color: accentFg, borderRadius: radius }}>Start</span>
                </div>
                <div className={mobile ? 'py-8' : 'py-12'}>
                  <p className="mb-3 text-[10px] uppercase tracking-widest opacity-50">{f.type || 'Welcome'}</p>
                  <p className={`leading-[1.02] transition-all duration-500 ${page.head} ${mobile ? 'text-2xl' : 'text-4xl'}`}>{headlines[f.type] ?? 'Your headline, big and clear.'}</p>
                  <p className="mt-4 max-w-xs text-[11px] leading-relaxed opacity-60">One or two sentences about what you offer, who it is for, and why it matters.</p>
                  <span className="mt-6 inline-block px-4 py-2 text-[11px] transition-all duration-500" style={{ background: accent, color: accentFg, borderRadius: radius }}>Get in touch</span>
                  {f.features.length > 0 && (
                    <div className="mt-8 flex flex-wrap gap-1.5">
                      {f.features.slice(0, mobile ? 3 : 6).map((x) => (
                        <span key={x} className="border px-2 py-0.5 text-[10px] opacity-70" style={{ borderColor: 'currentColor', borderRadius: radius }}>{x}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </aside>
        </div>

        <div className="mt-16 grid gap-10 md:grid-cols-2">
          <div>
            <h2 className="mb-4 font-mono text-xs text-signal-soft">What happens when you send</h2>
            <Flow vertical steps={['Your email app opens, already filled in', 'You press send', 'I usually reply within two working days']} />
          </div>
          <p className="self-end text-sm leading-relaxed text-mute">
            Rather skip the form?{' '}
            <a href={`mailto:${EMAIL}`} className="text-paper underline decoration-line underline-offset-4 hover:decoration-signal-soft">Email me</a>
            ,{' '}
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="text-paper underline decoration-line underline-offset-4 hover:decoration-signal-soft">
              <span className="mr-1 inline-block align-[-0.2em]"><WhatsAppIcon size={16} /></span>message me on WhatsApp
            </a>
            {' '}or find me on{' '}
            <a href="https://linkedin.com/in/ullas-js-7694391b2/" target="_blank" rel="noopener noreferrer" className="text-paper underline decoration-line underline-offset-4 hover:decoration-signal-soft">LinkedIn</a>.
          </p>
        </div>
      </div>
    </section>
  );
}
