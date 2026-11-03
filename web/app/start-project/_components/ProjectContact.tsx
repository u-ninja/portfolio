'use client'
import { useState, type FormEvent } from 'react'
import { useInView } from '../../hooks/useInView'

const EMAIL = 'hello@teeme.org'

const projectTypes = ['Web app', 'Website', 'Dashboard / ERP', 'Something else']
const budgets = ['< $2k', '$2k – $5k', '$5k – $15k', '$15k+', 'Not sure yet']

const inputClass =
	'w-full bg-transparent border-b border-[rgba(255,255,255,0.12)] focus:border-[#c4f135] outline-none py-3 text-white placeholder:text-[#444] transition-colors duration-200'

const labelClass = 'block text-xs tracking-[0.15em] uppercase text-[#666] mb-1'

function Chips({
	name,
	options,
	value,
	onChange,
}: {
	name: string
	options: string[]
	value: string
	onChange: (v: string) => void
}) {
	return (
		<div role='radiogroup' aria-label={name} className='flex flex-wrap gap-2 mt-3'>
			{options.map((opt) => {
				const active = value === opt
				return (
					<button
						key={opt}
						type='button'
						role='radio'
						aria-checked={active}
						onClick={() => onChange(active ? '' : opt)}
						className={`text-sm px-4 py-2 rounded-full border transition-all duration-200 cursor-pointer ${
							active
								? 'bg-[#c4f135] border-[#c4f135] text-black'
								: 'border-[rgba(255,255,255,0.15)] text-[#999] hover:border-white hover:text-white'
						}`}>
						{opt}
					</button>
				)
			})}
		</div>
	)
}

export function ProjectContact() {
	const { ref, inView } = useInView<HTMLElement>(0.1)
	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [type, setType] = useState('')
	const [budget, setBudget] = useState('')
	const [details, setDetails] = useState('')
	const [sent, setSent] = useState(false)

	function onSubmit(e: FormEvent) {
		e.preventDefault()
		const subject = `New project${type ? ` — ${type}` : ''} from ${name}`
		const body = [
			`Name: ${name}`,
			`Email: ${email}`,
			type ? `Project type: ${type}` : null,
			budget ? `Budget: ${budget}` : null,
			'',
			details,
		]
			.filter((l) => l !== null)
			.join('\n')
		window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
		setSent(true)
	}

	return (
		<section id='project-form' ref={ref} className='relative'>
			<div className='max-w-6xl mx-auto px-6 md:px-10 py-24 md:py-32 grid md:grid-cols-[1fr_1.6fr] gap-16'>
				{/* Left column */}
				<div className={`reveal ${inView ? 'visible' : ''}`}>
					<span className='text-xs tracking-[0.18em] text-[#444] uppercase'>Project brief</span>
					<h2
						className='font-black text-white leading-[0.95] tracking-[-0.03em] mt-6 mb-6'
						style={{ fontFamily: 'var(--font-archivo), sans-serif', fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
						Tell me what
						<br />
						<span className='text-[#333]'>you&apos;re building.</span>
					</h2>
					<p className='text-[#555] leading-relaxed max-w-sm mb-10'>
						Submitting opens your email app with everything filled in. I usually reply within two working
						days.
					</p>
					<div className='space-y-3 text-sm'>
						<a
							href={`mailto:${EMAIL}`}
							className='block text-[#999] hover:text-white transition-colors duration-200'>
							{EMAIL}
						</a>
						<a
							href='https://linkedin.com/in/ullas-js-7694391b2/'
							target='_blank'
							rel='noopener noreferrer'
							className='block text-[#444] hover:text-white transition-colors duration-200'>
							LinkedIn ↗
						</a>
					</div>
				</div>

				{/* Form */}
				<form onSubmit={onSubmit} className={`space-y-10 reveal reveal-delay-1 ${inView ? 'visible' : ''}`}>
					<div className='grid sm:grid-cols-2 gap-10'>
						<div>
							<label htmlFor='pc-name' className={labelClass}>
								Name
							</label>
							<input
								id='pc-name'
								required
								autoComplete='name'
								value={name}
								onChange={(e) => setName(e.target.value)}
								placeholder='Your name'
								className={inputClass}
							/>
						</div>
						<div>
							<label htmlFor='pc-email' className={labelClass}>
								Email
							</label>
							<input
								id='pc-email'
								type='email'
								required
								autoComplete='email'
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder='you@company.com'
								className={inputClass}
							/>
						</div>
					</div>

					<div>
						<span className={labelClass}>Project type</span>
						<Chips name='Project type' options={projectTypes} value={type} onChange={setType} />
					</div>

					<div>
						<span className={labelClass}>Budget</span>
						<Chips name='Budget' options={budgets} value={budget} onChange={setBudget} />
					</div>

					<div>
						<label htmlFor='pc-details' className={labelClass}>
							Details
						</label>
						<textarea
							id='pc-details'
							required
							rows={5}
							value={details}
							onChange={(e) => setDetails(e.target.value)}
							placeholder='Goals, timeline, links to anything that exists today…'
							className={`${inputClass} resize-y`}
						/>
					</div>

					<div className='flex flex-col sm:flex-row sm:items-center gap-5'>
						<button
							type='submit'
							className='inline-flex items-center justify-center px-7 py-3.5 rounded-full bg-white text-black text-sm font-semibold hover:bg-[#c4f135] transition-colors duration-200 cursor-pointer'>
							Send project brief
						</button>
						{sent && (
							<p role='status' className='text-sm text-[#666]'>
								Email app didn&apos;t open? Write to{' '}
								<a href={`mailto:${EMAIL}`} className='text-[#c4f135] hover:underline'>
									{EMAIL}
								</a>
								.
							</p>
						)}
					</div>
				</form>
			</div>
		</section>
	)
}
