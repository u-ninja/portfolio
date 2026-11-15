'use client';
import { useState, type FormEvent } from 'react';
import { base, type Tailored } from './base';
import { CvSheet, LetterSheet } from './Cv';

export default function Tailor() {
  const [jd, setJd] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<Tailored | null>(null);
  const [light, setLight] = useState(true); // print version by default: safest for applications
  const [printing, setPrinting] = useState<'cv' | 'letter'>('cv');

  async function generate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const password = String(new FormData(e.currentTarget).get('password'));
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/tailor', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ password, jd }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error && err.message ? err.message : 'Could not reach the server. Check your connection and try again.');
    } finally {
      setBusy(false);
    }
  }

  function print(which: 'cv' | 'letter') {
    setPrinting(which);
    // wait one frame so the other sheet is hidden before the print dialog opens
    requestAnimationFrame(() => window.print());
  }

  return (
    <main data-print={printing} className="mx-auto max-w-[230mm] px-6 py-12">
      <div className="no-print">
        <h1 className="display mb-3 text-5xl">Tailor</h1>
        <p className="mb-8 max-w-xl text-mute">
          Paste a job description. You get a CV and a cover letter rewritten for that role, using only what is true
          about your work.
        </p>

        <form onSubmit={generate} className="space-y-4">
          <label className="block font-mono text-xs text-mute">
            Password
            <input
              name="password" type="password" required autoComplete="current-password"
              className="mt-2 block w-full max-w-xs border border-line bg-panel px-3 py-2 text-sm text-paper"
            />
          </label>
          <label className="block font-mono text-xs text-mute">
            Job description
            <textarea
              value={jd} onChange={(e) => setJd(e.target.value)} required rows={12}
              className="mt-2 block w-full border border-line bg-panel px-3 py-2 font-display text-sm leading-relaxed text-paper"
            />
          </label>
          <div className="flex flex-wrap items-center gap-3">
            <button type="submit" disabled={busy} className="btn btn-solid cursor-pointer disabled:opacity-50">
              {busy ? 'Writing…' : 'Tailor CV and letter'}
            </button>
            <button type="button" className="btn cursor-pointer" onClick={() => setLight(!light)}>
              {light ? 'Switch to dark sheet' : 'Switch to print sheet'}
            </button>
            {result && (
              <>
                <button type="button" className="btn cursor-pointer" onClick={() => print('cv')}>Save CV as PDF</button>
                <button type="button" className="btn cursor-pointer" onClick={() => print('letter')}>Save letter as PDF</button>
              </>
            )}
          </div>
          <p role="alert" className="font-mono text-sm text-signal-soft">{error}</p>
        </form>

        {result && result.gaps.length > 0 && (
          <div className="my-8 border-l border-signal pl-5">
            <h2 className="mb-2 font-mono text-xs text-signal-soft">The role asks for these, and your CV cannot honestly claim them</h2>
            <ul className="space-y-1 text-sm text-mute">{result.gaps.map((g) => <li key={g}>{g}</li>)}</ul>
          </div>
        )}
        <p className="mb-4 mt-10 font-mono text-xs text-mute">
          {result ? 'Tailored. Read it before you send it.' : 'Preview: your current CV.'}
        </p>
      </div>

      <div className="space-y-8 overflow-x-auto print:space-y-0 print:overflow-visible">
        <CvSheet cv={result?.cv ?? base} light={light} />
        {result && <LetterSheet paragraphs={result.letter} light={light} />}
      </div>
    </main>
  );
}
