import { StepScroll } from './components/StepScroll';
import { Cursor } from './components/Cursor';
import { Preloader } from './components/Preloader';
import { Nav } from './components/Nav';
import { ParticleField } from './scenes/ParticleField';
import { FlowRail } from './scenes/FlowRail';
import { Hero } from './scenes/Hero';
import { Statements } from './scenes/Statements';
import { Universe } from './scenes/Universe';
import { Projects } from './scenes/Projects';
import { Bento } from './scenes/Bento';
import { Architecture } from './scenes/Architecture';
import { Experience } from './scenes/Experience';
import { Playground } from './scenes/Playground';
import { Invitation } from './scenes/Invitation';

export default function Home() {
  return (
    <>
      <Preloader />
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
        <Bento />
        <Architecture />
        <Experience />
        <Playground />
        <Invitation />
      </main>
    </>
  );
}
