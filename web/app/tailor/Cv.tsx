import type { Cv } from './base';

function Header({ title }: { title?: string }) {
  return (
    <header>
      <div>
        <p className="mono prompt"><span>$</span> ullas --resume</p>
        <h1>Ullas JS</h1>
        {title && <p className="title">{title}</p>}
      </div>
      <p className="mono contact">
        <b>Kochi, India</b><br />
        Open to relocation (UAE, Australia, Germany) and remote<br />
        +91 90743 76257 / <b>ullasjskadakkal75@gmail.com</b><br />
        linkedin.com/in/ullas-js-7694391b2<br />
        github.com/UllasJs / <b>teeme.org</b>
      </p>
    </header>
  );
}

/** Same markup as resume/resume.html, filled from data. */
export function CvSheet({ cv, light }: { cv: Cv; light: boolean }) {
  return (
    <div className={`cv sheet-cv ${light ? 'light' : ''}`}>
      <Header title={cv.title} />

      <section>
        <h2>Summary</h2>
        <p className="lead">{cv.summary}</p>
      </section>

      <section>
        <h2>Experience <small>git log --career</small></h2>
        <div>
          {cv.jobs.map((j) => (
            <div key={j.role + j.company} className="job">
              <div className="row"><h3>{j.role} <span>/ {j.company}</span></h3><span className="mono when">{j.when}</span></div>
              {j.note && <p className="mono note">{j.note}</p>}
              <ul>{j.points.map((p) => <li key={p}>{p}</li>)}</ul>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2>Projects <small>ship(projects)</small></h2>
        <div>
          {cv.projects.map((p) => (
            <div key={p.name} className="proj">
              <div className="row"><h3>{p.name} {p.tagline && <span>/ {p.tagline}</span>}</h3><span className="mono when">{p.link}</span></div>
              <p className="mono stack">{p.stack}</p>
              <ul>{p.points.map((x) => <li key={x}>{x}</li>)}</ul>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2>Skills</h2>
        <dl>
          {cv.skills.map((s) => [<dt key={s.label} className="mono">{s.label}</dt>, <dd key={s.label + 'v'}>{s.items}</dd>])}
        </dl>
      </section>

      <section>
        <h2>Education</h2>
        <div className="row">
          <h3>B.Tech, Computer Science <span>/ Vidya Academy of Science and Technology, Kerala</span></h3>
          <span className="mono when">CGPA 8.6/10 / 2019 – 2023</span>
        </div>
      </section>
    </div>
  );
}

export function LetterSheet({ paragraphs, light }: { paragraphs: string[]; light: boolean }) {
  return (
    <div className={`cv sheet-letter ${light ? 'light' : ''}`}>
      <Header />
      <div className="letter">
        <p className="mono" style={{ color: 'var(--mute)' }}>
          {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
        <p>Dear hiring team,</p>
        {paragraphs.map((p) => <p key={p}>{p}</p>)}
        <p>Regards,<br />Ullas JS</p>
      </div>
    </div>
  );
}
