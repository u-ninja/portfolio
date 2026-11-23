'use client';
import Link from 'next/link';
import { SceneHead } from './SceneHead';
import { Showcase } from './Showcase';
import { projects } from '../data/projects';

export function Projects() {
  return (
    <section id="work" data-shape="dust" data-alpha="0.22" className="relative px-6 py-24 md:px-10 md:py-36">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 md:mb-24">
          <SceneHead fn="projects.forEach(ship)" title="Selected work">
            Five things I built and shipped. Each one is a working demo: scroll to follow the story, or use the controls
            yourself.
          </SceneHead>
        </div>
        <Link href="/work" className="mb-12 inline-block font-mono text-sm text-signal-soft underline underline-offset-4 hover:text-paper">All projects →</Link>
        <div className="space-y-20 md:space-y-28">
          {projects.map((p) => <Showcase key={p.title} project={p} />)}
        </div>
      </div>
    </section>
  );
}
