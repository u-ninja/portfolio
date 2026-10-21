import { Nav } from "../components/Nav";
import { ProjectContact } from "./_components/ProjectContact";
import { ProjectHero } from "./_components/ProjectHero";

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
