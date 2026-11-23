import { StepScroll } from './components/StepScroll';
import { Cursor } from './components/Cursor';
import { Nav } from './components/Nav';
import { ParticleField } from './scenes/ParticleField';
import { FlowRail } from './scenes/FlowRail';
import { Hero } from './scenes/Hero';
import { Statements } from './scenes/Statements';
import { Universe } from './scenes/Universe';
import { Projects } from './scenes/Projects';
import { Architecture } from './scenes/Architecture';
import { Experience } from './scenes/Experience';
import { Playground } from './scenes/Playground';
import { Invitation } from './scenes/Invitation';

export default function Home() {
  return (
    <>
      <ParticleField />
      <Nav />
      <StepScroll />
      <Cursor />
      <FlowRail />
      <main className="relative z-10">
        <Hero />
        <Statements />
        <Universe />
        <Projects />
        <Architecture />
        <Experience />
        <Playground />
        <Invitation />
      </main>
    </>
  );
}
