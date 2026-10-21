'use client'
import { useEffect, useState } from 'react'

// SVG noise texture as data URI — rendered once, composited at low opacity
const noiseSvg = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`

export function ProjectHero() {
	const [mounted, setMounted] = useState(false)
	useEffect(() => {
		setMounted(true)
	}, [])

	return (
		<section
			className='relative min-h-screen flex flex-col justify-end pb-20 md:pb-28 overflow-hidden'
			style={{
				background: 'radial-gradient(ellipse 90% 65% at 50% -5%, #131313 0%, #080808 55%, #040404 100%)',
			}}>
			{/* Grain texture overlay */}
			<div
				aria-hidden='true'
				className='pointer-events-none absolute inset-0 z-0'
				style={{
					backgroundImage: noiseSvg,
					backgroundRepeat: 'repeat',
					backgroundSize: '300px 300px',
					opacity: 0.035,
					mixBlendMode: 'overlay',
				}}
			/>

			{/* Subtle lime glow at top center */}
			<div
				aria-hidden='true'
				className='pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] z-0'
				style={{
					background: 'radial-gradient(ellipse at 50% 0%, rgba(196,241,53,0.04) 0%, transparent 70%)',
				}}
			/>

			<div className='relative z-10 max-w-6xl mx-auto px-6 md:px-10 w-full'>
				{/* Status */}
				<div
					className={`flex items-center gap-2.5 mb-8 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
					style={{ transitionDelay: '0.1s' }}>
					<span className='relative flex h-2 w-2'>
						<span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c4f135] opacity-75' />
						<span className='relative inline-flex rounded-full h-2 w-2 bg-[#c4f135]' />
					</span>
					<span
						className='text-xs text-[#666] tracking-[0.15em] uppercase'
						style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}>
						Start a project
					</span>
				</div>

				{/* Name */}
				<h1
					className={`font-black text-white leading-[0.88] tracking-[-0.03em] mb-10 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
					style={{
						fontFamily: 'var(--font-archivo), sans-serif',
						fontSize: 'clamp(2rem, 16vw, 6.5rem)',
						transitionDelay: '0.2s',
					}}>
					Have a project in mind?
				</h1>

				{/* Bottom row */}
				<div
					className={`flex flex-col md:flex-row md:items-end md:justify-between gap-8 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
					style={{ transitionDelay: '0.35s' }}>
					<div>
						<p className='text-[#555] text-base leading-relaxed max-w-md'>
							I work directly with clients to understand what needs to be built, then design and develop
							it myself. Tell me about the project — the more context you give, the more useful my first
							reply will be.
						</p>
					</div>
				</div>
			</div>

			{/* Bottom divider */}
			<div
				aria-hidden='true'
				className='absolute bottom-0 left-0 right-0 h-px z-10'
				style={{
					background:
						'linear-gradient(90deg, transparent, rgba(255,255,255,0.06) 20%, rgba(255,255,255,0.06) 80%, transparent)',
				}}
			/>
		</section>
	)
}
