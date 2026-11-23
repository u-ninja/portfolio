import { Pit } from './Pit';
import { Magnetic } from '../components/Magnetic';

export function Hero() {
  return (
    <section id="top" className="relative flex min-h-svh flex-col justify-between overflow-hidden pt-24">
      <div className="mx-auto w-full max-w-6xl px-6 md:px-10">
        <p className="fade-in mb-5 font-mono text-xs text-mute" style={{ '--d': 0 } as React.CSSProperties}>
          Senior software engineer · Kochi, India · Open to remote and relocation
        </p>
        <h1 className="display text-[clamp(2.8rem,min(8vw,13svh),7.5rem)]">
          {['I build products', 'that are fast,'].map((l, i) => (
            <span key={l} className="line-mask"><span style={{ '--d': i + 1 } as React.CSSProperties}>{l}</span></span>
          ))}
          <span className="line-mask"><span style={{ '--d': 3 } as React.CSSProperties}><em>reliable and kind.</em></span></span>
        </h1>
        <div className="fade-in mt-6 flex flex-col gap-6 md:flex-row md:items-end md:justify-between" style={{ '--d': 5 } as React.CSSProperties}>
          <p className="max-w-md leading-relaxed text-mute">
            Nearly four years shipping production platforms in React, Next.js, TypeScript and Node.js. I lead the team behind
            SAP-integrated warehouse systems, and I run my own SaaS, Teeme.
          </p>
          <div className="flex flex-wrap gap-3">
            <Magnetic><a href="mailto:hello@teeme.org" className="btn btn-solid">Email me</a></Magnetic>
            <Magnetic><a href="/Ullas_JS_Resume.pdf" download className="btn">Résumé</a></Magnetic>
          </div>
        </div>
      </div>
      <div className="fade-in mx-auto mt-10 w-full max-w-6xl px-6 md:px-10" style={{ '--d': 7 } as React.CSSProperties}>
        <Pit />
        <p className="pb-4 pt-2 font-mono text-xs text-mute">↑ pick them up, throw them around</p>
      </div>
    </section>
  );
}
