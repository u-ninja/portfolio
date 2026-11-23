import { Nav } from './components/Nav';
import { Hero } from './scenes/Hero';
import { Work } from './scenes/Work';
import { Numbers } from './scenes/Numbers';
import { Experience } from './scenes/Experience';
import { Invitation } from './scenes/Invitation';

export default function Home() {
  return (
    <>
      <Nav />
      <main className="relative z-10">
        <Hero />
        <Work />
        <Numbers />
        <Experience />
        <Invitation />
      </main>
    </>
  );
}
