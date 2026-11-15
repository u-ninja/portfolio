import type { Metadata } from 'next';
import { Nav } from '../components/Nav';
import { ParticleField } from '../scenes/ParticleField';
import { Brief } from './_components/Brief';

export const metadata: Metadata = {
  title: 'Start a project — Ullas JS',
  description: 'Tell me about the project you want to build — web apps, dashboards, ERPs and more.',
};

const lines = ['Have a project', 'in mind?'];

export default function StartProject() {
  return (
    <>
      <ParticleField />
      <Nav />
      <main className="relative z-10">
        <section
          data-shape="knot"
          data-alpha="0.55"
          data-x="0.55"
          data-scale="0.8"
          className="px-6 pb-16 pt-36 md:px-10 md:pb-24 md:pt-44"
        >
          <div className="mx-auto max-w-6xl">
            <p className="fade-in mb-6 font-mono text-sm text-signal-soft">startProject(brief)</p>
            <h1 className="display mb-8 text-[clamp(3rem,10vw,9rem)]">
              {lines.map((line, i) => (
                <span key={line} className="line-mask">
                  <span style={{ '--d': i } as React.CSSProperties}>{line}</span>
                </span>
              ))}
            </h1>
            <p className="fade-in max-w-xl text-lg leading-relaxed text-mute" style={{ '--d': 3 } as React.CSSProperties}>
              I work directly with clients to understand what needs to be built, then design and develop it myself.
              The more context you give, the more useful my first reply will be.
            </p>
          </div>
        </section>
        <div data-shape="dust" data-alpha="0.18">
          <Brief />
        </div>
      </main>
    </>
  );
}
