'use client';
import { useEffect, useRef } from 'react';
import Matter from 'matter-js';
import { reducedMotion } from '../lib/scroll';

const SKILLS = ['React', 'Next.js', 'TypeScript', 'Node.js', 'PostgreSQL', 'Socket.IO', 'Azure', 'SAP S/4HANA', 'Rust', 'Prisma', 'Vue', 'Docker', 'Tailwind', 'Claude API'];

// Skill tiles fall into a pit and can be thrown around. DOM chips follow the bodies, so text stays crisp and selectable.
// shortcut: bodies are rectangles sized from the chip's DOM box; re-measure only on resize.
export function Pit() {
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const chips = [...el.querySelectorAll<HTMLElement>('[data-chip]')];
    if (reducedMotion()) return; // CSS fallback lays the chips out as a wrapped row

    const { Engine, Bodies, Body, Composite, Mouse, MouseConstraint, Runner } = Matter;
    const engine = Engine.create({ gravity: { y: 1.1 } });
    const W = () => el.clientWidth, H = () => el.clientHeight;
    const walls = () => {
      const t = 200;
      return [
        Bodies.rectangle(W() / 2, H() + t / 2, W() * 3, t, { isStatic: true }),
        Bodies.rectangle(-t / 2, H() / 2, t, H() * 6, { isStatic: true }),
        Bodies.rectangle(W() + t / 2, H() / 2, t, H() * 6, { isStatic: true }),
      ];
    };
    let wallSet = walls();
    Composite.add(engine.world, wallSet);

    const bodies = chips.map((c, i) => {
      const w = c.offsetWidth, h = c.offsetHeight;
      const b = Bodies.rectangle(w / 2 + Math.random() * Math.max(1, W() - w), -h - i * 70, w, h, {
        restitution: 0.35, friction: 0.4, frictionAir: 0.01, angle: (Math.random() - 0.5) * 0.8,
      });
      return b;
    });
    Composite.add(engine.world, bodies);

    const mouse = Mouse.create(el);
    // matter's mouse swallows wheel events; hand them back so the page still scrolls
    el.removeEventListener('mousewheel', (mouse as unknown as { mousewheel: EventListener }).mousewheel);
    el.removeEventListener('DOMMouseScroll', (mouse as unknown as { mousewheel: EventListener }).mousewheel);
    const drag = MouseConstraint.create(engine, { mouse, constraint: { stiffness: 0.2, damping: 0.1, render: { visible: false } } });
    Composite.add(engine.world, drag);

    const runner = Runner.create();
    let running = false;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !running) { Runner.run(runner, engine); running = true; }
      else if (!e.isIntersecting && running) { Runner.stop(runner); running = false; }
    });
    io.observe(el);

    let raf = 0;
    const draw = () => {
      bodies.forEach((b, i) => {
        chips[i].style.transform = `translate(${b.position.x - chips[i].offsetWidth / 2}px,${b.position.y - chips[i].offsetHeight / 2}px) rotate(${b.angle}rad)`;
      });
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    // re-seat the floor and walls when the box changes size, and keep stray chips inside
    const ro = new ResizeObserver(() => {
      Composite.remove(engine.world, wallSet);
      wallSet = walls();
      Composite.add(engine.world, wallSet);
      bodies.forEach((b) => {
        if (b.position.x > W()) Body.setPosition(b, { x: W() - 40, y: Math.min(b.position.y, H() - 40) });
      });
    });
    ro.observe(el);

    return () => {
      cancelAnimationFrame(raf); io.disconnect(); ro.disconnect(); Runner.stop(runner);
      Composite.clear(engine.world, false); Engine.clear(engine);
    };
  }, []);

  return (
    <div
      ref={box}
      aria-hidden="true"
      data-physics
      className="pit relative h-[30svh] min-h-[14rem] w-full select-none overflow-hidden md:h-[34svh]"
    >
      {SKILLS.map((s) => (
        <span key={s} data-chip className="pit-chip">{s}</span>
      ))}
    </div>
  );
}
