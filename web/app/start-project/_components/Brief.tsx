'use client';
import { useState, type FormEvent } from 'react';
import { Flow, Window } from '../../scenes/demos/Window';
import { WHATSAPP_URL, WhatsAppIcon } from '../../components/WhatsApp';

const EMAIL = 'hello@teeme.org';
const projectTypes = ['Web app', 'Website', 'Dashboard / ERP', 'Something else'];
const budgets = ['< $2k', '$2k – $5k', '$5k – $15k', '$15k+', 'Not sure yet'];

const label = 'block font-mono text-xs text-mute';
const input =
  'mt-2 w-full font-display border-b border-line bg-transparent py-3 text-lg text-paper outline-none transition-colors duration-200 placeholder:text-mute/60 focus:border-signal-soft';

function Chips({ name, options, value, onChange }: { name: string; options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div role="radiogroup" aria-label={name} className="mt-3 flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = value === opt;
        return (
          <button
            key={opt}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(active ? '' : opt)}
            className={`cursor-pointer border px-4 py-2 font-mono text-sm transition-colors duration-200 ${
              active ? 'border-signal bg-signal text-white' : 'border-line text-mute hover:border-paper hover:text-paper'
            }`}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

/** One line of the live preview: a filled value in white, a missing one as a comment. */
function Arg({ k, v, required }: { k: string; v: string; required?: boolean }) {
  const short = v.length > 46 ? `${v.slice(0, 46).trimEnd()}…` : v;
  return (
    <div className="truncate pl-4">
      <span className="text-signal-soft">{k}</span>:{' '}
      {v ? <span className="text-paper">&quot;{short.replace(/\s+/g, ' ')}&quot;</span> : <span>{required ? '/* required */' : '/* optional */'}</span>},
    </div>
  );
}

export function Brief() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [type, setType] = useState('');
  const [budget, setBudget] = useState('');
  const [details, setDetails] = useState('');
  const [sent, setSent] = useState(false);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const subject = `New project${type ? ` — ${type}` : ''} from ${name}`;
    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      type ? `Project type: ${type}` : null,
      budget ? `Budget: ${budget}` : null,
      '',
      details,
    ]
      .filter((l) => l !== null)
      .join('\n');
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  }

  return (
    <section id="project-form" className="px-6 pb-24 md:px-10 md:pb-32">
      <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-[1.25fr_1fr] lg:gap-20">
        <form onSubmit={onSubmit} className="space-y-10">
          <div className="grid gap-10 sm:grid-cols-2">
            <label className={label}>
              name
              <input required autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className={input} />
            </label>
            <label className={label}>
              email
              <input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" className={input} />
            </label>
          </div>

          <div>
            <span className={label}>type</span>
            <Chips name="Project type" options={projectTypes} value={type} onChange={setType} />
          </div>

          <div>
            <span className={label}>budget</span>
            <Chips name="Budget" options={budgets} value={budget} onChange={setBudget} />
          </div>

          <label className={label}>
            details
            <textarea
              required rows={5} value={details} onChange={(e) => setDetails(e.target.value)}
              placeholder="Goals, timeline, links to anything that exists today"
              className={`${input} resize-y`}
            />
          </label>

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <button type="submit" className="btn btn-solid cursor-pointer">Send project brief</button>
            {sent && (
              <p role="status" className="text-sm text-mute">
                Email app didn’t open?{' '}
                <a href={`mailto:${EMAIL}`} className="text-signal-soft underline underline-offset-4">Email me directly</a>.
              </p>
            )}
          </div>
        </form>

        <aside className="space-y-8 lg:sticky lg:top-28 lg:self-start">
          <div className="h-auto">
            <Window title="brief.ts" note="updates as you type">
              <pre aria-hidden="true" className="font-mono text-xs leading-6 text-mute">
                <div><span className="text-paper">startProject</span>({'{'}</div>
                <Arg k="name" v={name} required />
                <Arg k="email" v={email} required />
                <Arg k="type" v={type} />
                <Arg k="budget" v={budget} />
                <Arg k="details" v={details} required />
                <div>{'}'});</div>
              </pre>
            </Window>
          </div>

          <div>
            <h2 className="mb-4 font-mono text-xs text-signal-soft">What happens when you send</h2>
            <Flow vertical steps={['Your email app opens, already filled in', 'You press send', 'I usually reply within two working days']} />
          </div>

          <p className="text-sm leading-relaxed text-mute">
            Rather skip the form?{' '}
            <a href={`mailto:${EMAIL}`} className="text-paper underline decoration-line underline-offset-4 hover:decoration-signal-soft">Email me</a>
            ,{' '}
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="text-paper underline decoration-line underline-offset-4 hover:decoration-signal-soft">
              <span className="mr-1 inline-block align-[-0.2em]"><WhatsAppIcon size={16} /></span>message me on WhatsApp
            </a>
            {' '}or find me on{' '}
            <a href="https://linkedin.com/in/ullas-js-7694391b2/" target="_blank" rel="noopener noreferrer" className="text-paper underline decoration-line underline-offset-4 hover:decoration-signal-soft">LinkedIn</a>.
          </p>
        </aside>
      </div>
    </section>
  );
}
