'use client';
import { useEffect, useRef } from 'react';
import { reducedMotion } from '../../lib/scroll';
import { Window } from './Window';

const W = 520, H = 340;
const NEAR = 95, FAR = 330, CONE = 0.3; // peripheral radius, weapon sight distance and half-angle
type Rect = [number, number, number, number];
const high: Rect[] = [[90, 60, 70, 22], [300, 40, 24, 100], [170, 190, 120, 22], [400, 215, 24, 90]]; // blocks vision
const low: Rect[] = [[50, 250, 70, 18], [330, 165, 70, 18]]; // blocks movement and bullets, not vision
const enemies = [[465, 70], [250, 295], [55, 150], [470, 305], [250, 100]];
const patrol = [[40, 310], [150, 140], [270, 160], [360, 300], [480, 180], [360, 300], [270, 160], [150, 140]];

const segs: number[][] = [[0, 0, W, 0], [W, 0, W, H], [W, H, 0, H], [0, H, 0, 0]];
for (const [x, y, w, h] of high) segs.push([x, y, x + w, y], [x + w, y, x + w, y + h], [x + w, y + h, x, y + h], [x, y + h, x, y]);

/** Distance along the ray from (ox,oy) at `ang` to the nearest vision-blocking wall. */
function cast(ox: number, oy: number, ang: number) {
  const dx = Math.cos(ang), dy = Math.sin(ang);
  let best = 1e9;
  for (const [x1, y1, x2, y2] of segs) {
    const sx = x2 - x1, sy = y2 - y1;
    const den = dx * sy - dy * sx;
    if (Math.abs(den) < 1e-9) continue;
    const t = ((x1 - ox) * sy - (y1 - oy) * sx) / den;
    const u = ((x1 - ox) * dy - (y1 - oy) * dx) / den;
    if (t > 0 && u >= 0 && u <= 1 && t < best) best = t;
  }
  return best;
}

export function BlacksiteDemo({ stage }: { stage: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef(stage);
  useEffect(() => { stageRef.current = stage; }, [stage]);

  useEffect(() => {
    const cv = ref.current;
    const ctx = cv?.getContext('2d');
    if (!cv || !ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    cv.width = W * dpr;
    cv.height = H * dpr;
    const still = reducedMotion();
    let px = 150, py = 140, aim = 0, wp = 1, raf = 0, visible = false;
    let pointer: number[] | null = null;

    const draw = () => {
      // shortcut: the operator ignores collisions and walks through cover; add a movement layer if this becomes a game
      const [tx, ty] = pointer ?? patrol[wp];
      const dx = tx - px, dy = ty - py, dist = Math.hypot(dx, dy);
      if (!still && dist > 2) {
        const speed = Math.min(pointer ? 4 : 1.1, dist);
        px += (dx / dist) * speed;
        py += (dy / dist) * speed;
        const turn = Math.atan2(Math.sin(Math.atan2(dy, dx) - aim), Math.cos(Math.atan2(dy, dx) - aim));
        aim += turn * 0.08;
      } else if (!pointer) wp = (wp + 1) % patrol.length;

      // visibility polygon: a ray at every wall corner, and one just either side of it
      const angles: number[] = [];
      for (const s of segs) {
        const a = Math.atan2(s[1] - py, s[0] - px);
        angles.push(a - 1e-4, a, a + 1e-4);
      }
      angles.sort((a, b) => a - b);
      const poly = angles.map((a) => {
        const t = cast(px, py, a);
        return [px + Math.cos(a) * t, py + Math.sin(a) * t];
      });

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = '#080a11';
      ctx.fillRect(0, 0, W, H);

      ctx.save();
      ctx.beginPath();
      poly.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
      ctx.clip();
      ctx.fillStyle = 'rgba(134,168,255,0.26)';
      ctx.beginPath();
      ctx.arc(px, py, NEAR, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.arc(px, py, FAR, aim - CONE, aim + CONE);
      ctx.fill();
      ctx.restore();

      const debug = stageRef.current >= 1;
      if (debug) {
        ctx.strokeStyle = 'rgba(134,168,255,0.16)';
        ctx.beginPath();
        for (let i = 0; i < poly.length; i += 3) {
          ctx.moveTo(px, py);
          ctx.lineTo(poly[i][0], poly[i][1]);
        }
        ctx.stroke();
      }

      ctx.fillStyle = '#1c2130';
      ctx.strokeStyle = '#3a4258';
      ctx.setLineDash([]);
      for (const [x, y, w, h] of high) {
        ctx.fillRect(x, y, w, h);
        ctx.strokeRect(x, y, w, h);
      }
      ctx.setLineDash([4, 3]);
      for (const [x, y, w, h] of low) ctx.strokeRect(x, y, w, h);
      ctx.setLineDash([]);

      for (const [ex, ey] of enemies) {
        const d = Math.hypot(ex - px, ey - py);
        const ang = Math.atan2(ey - py, ex - px);
        const off = Math.abs(Math.atan2(Math.sin(ang - aim), Math.cos(ang - aim)));
        // seen = inside either awareness layer AND the ray on the vision layer is clear
        const seen = (d < NEAR || (d < FAR && off < CONE)) && cast(px, py, ang) > d;
        if (!seen && !debug) continue;
        ctx.beginPath();
        ctx.arc(ex, ey, 6, 0, Math.PI * 2);
        if (seen) {
          ctx.fillStyle = '#ff5a5a';
          ctx.fill();
        } else {
          ctx.strokeStyle = '#5a6278';
          ctx.stroke();
        }
      }

      ctx.fillStyle = '#2f6bff';
      ctx.beginPath();
      ctx.arc(px, py, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#f3f5f9';
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(px + Math.cos(aim) * 16, py + Math.sin(aim) * 16);
      ctx.stroke();

      if (visible && !still) raf = requestAnimationFrame(draw);
    };

    const toLocal = (e: PointerEvent) => {
      const r = cv.getBoundingClientRect();
      pointer = [((e.clientX - r.left) / r.width) * W, ((e.clientY - r.top) / r.height) * H];
    };
    const leave = () => { pointer = null; };
    cv.addEventListener('pointermove', toLocal);
    cv.addEventListener('pointerdown', toLocal);
    cv.addEventListener('pointerleave', leave);

    // only simulate while the canvas is on screen
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible) raf = requestAnimationFrame(draw);
    });
    io.observe(cv);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      cv.removeEventListener('pointermove', toLocal);
      cv.removeEventListener('pointerdown', toLocal);
      cv.removeEventListener('pointerleave', leave);
    };
  }, []);

  return (
    <Window title="blacksite / vision" note="move your pointer to lead the operator">
      <canvas
        ref={ref}
        role="img"
        aria-label="Top-down arena. An operator's field of view is cut off by walls; enemies appear only while in sight."
        className="mx-auto block max-h-[calc(100%-2rem)] w-full touch-none object-contain"
        style={{ aspectRatio: `${W} / ${H}` }}
      />
      <p className="mt-2 font-mono text-[11px] text-mute">
        Solid blocks stop sight. Dashed blocks are low cover: they stop bullets, not eyes.
      </p>
    </Window>
  );
}
