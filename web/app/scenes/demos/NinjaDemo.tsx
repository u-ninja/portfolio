'use client';
import { useState } from 'react';
import { useReducedMotion } from '../../lib/scroll';
import { Window } from './Window';

// [trend above 200-day average, fear-gauge gate passes] per story stage
const presets: [boolean, boolean][] = [[true, true], [false, true], [true, false], [true, true]];

const routes = {
  buy: 'M150,40 L150,320 L400,320',
  holdTrend: 'M150,40 L150,130 L430,130 L430,180 L505,180 L505,320 L470,320',
  holdFear: 'M150,40 L150,230 L430,230 L430,180 L505,180 L505,320 L470,320',
};

function Box({ x, y, w = 140, label, on }: { x: number; y: number; w?: number; label: string; on: boolean }) {
  return (
    <g>
      <rect x={x - w / 2} y={y - 18} width={w} height={36} fill="var(--color-ink)" stroke={on ? 'var(--color-signal)' : 'var(--color-line)'} strokeWidth={on ? 2 : 1} />
      <text x={x} y={y + 4} textAnchor="middle" fill={on ? 'var(--color-paper)' : 'var(--color-mute)'} fontSize="11">{label}</text>
    </g>
  );
}

function Diamond({ y, label, yes }: { y: number; label: string; yes: boolean }) {
  return (
    <g>
      <polygon points={`150,${y - 34} 236,${y} 150,${y + 34} 64,${y}`} fill="var(--color-ink)" stroke="var(--color-signal)" strokeWidth="2" />
      <text x="150" y={y + 4} textAnchor="middle" fill="var(--color-paper)" fontSize="10.5">{label}</text>
      <text x="250" y={y - 8} fill={yes ? 'var(--color-mute)' : 'var(--color-signal-soft)'} fontSize="10">no</text>
      <text x="160" y={y + 50} fill={yes ? 'var(--color-signal-soft)' : 'var(--color-mute)'} fontSize="10">yes</text>
    </g>
  );
}

export function NinjaDemo({ stage }: { stage: number }) {
  const still = useReducedMotion();
  const [pick, setPick] = useState<{ stage: number; v: [boolean, boolean] } | null>(null);
  const [trend, fear] = pick?.stage === stage ? pick.v : presets[stage];
  const route = !trend ? 'holdTrend' : !fear ? 'holdFear' : 'buy';
  const buys = route === 'buy';
  const toggle = (i: 0 | 1) => setPick({ stage, v: i === 0 ? [!trend, fear] : [trend, !fear] });

  return (
    <Window title="daily job" note="simplified rules, paper money">
      <svg viewBox="0 0 540 350" className="h-[calc(100%-3rem)] w-full font-mono" role="img" aria-label={`Decision flow. Result: ${buys ? 'buy on paper' : 'hold this month'}.`}>
        <g fill="none" stroke="var(--color-line)">
          {Object.values(routes).map((d) => <path key={d} d={d} />)}
        </g>
        <path key={route} d={routes[route]} fill="none" stroke="var(--color-signal)" strokeWidth="2" pathLength={1} className="edge" style={{ '--draw': 1 } as React.CSSProperties} />
        <Box x={150} y={40} label="Fetch market prices" on />
        <Diamond y={130} label="Above 200-day trend?" yes={trend} />
        <Diamond y={230} label="Fear gate passes?" yes={fear} />
        <Box x={150} y={320} label="Buy on paper" on={buys} />
        <Box x={430} y={180} w={130} label="Hold this month" on={!buys} />
        <Box x={400} y={320} label="Telegram summary" on />
        {!still && (
          <circle key={`dot-${route}`} r="5" fill="var(--color-signal-soft)">
            <animateMotion dur="3.2s" repeatCount="indefinite" path={routes[route]} />
          </circle>
        )}
      </svg>
      <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
        <span className="text-mute">Change today’s market:</span>
        <button type="button" aria-pressed={trend} onClick={() => toggle(0)} className="cursor-pointer border border-line px-2.5 py-1 hover:border-paper">
          trend {trend ? 'above' : 'below'}
        </button>
        <button type="button" aria-pressed={fear} onClick={() => toggle(1)} className="cursor-pointer border border-line px-2.5 py-1 hover:border-paper">
          fear gate {fear ? 'passes' : 'fails'}
        </button>
      </div>
    </Window>
  );
}
