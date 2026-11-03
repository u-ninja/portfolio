import type { Metadata } from 'next'
import { Nav } from '../components/Nav'
import { ProjectContact } from './_components/ProjectContact'
import { ProjectHero } from './_components/ProjectHero'

export const metadata: Metadata = {
	title: 'Start a project — Ullas JS',
	description: 'Tell me about the project you want to build — web apps, dashboards, ERPs and more.',
}

export default function StartProject() {
	return (
		<>
			<Nav />
			<main>
				<ProjectHero />
				<ProjectContact />
			</main>
		</>
	)
}
