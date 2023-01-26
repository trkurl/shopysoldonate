import { Card, PageHOC } from "../components"
import { NextPage } from "next"
import { useEffect } from "react"

import { useProject } from "../context"
import Head from "next/head"

const Home: NextPage = () => {
	const { projects } = useProject()

	return (
		<PageHOC>
			<Head>
				<title>ShopySol CrowdFunding</title>
			</Head>
			<div className="w-full h-full flex flex-col justify-start mt-2">
				<h1 className="text-white font-bold text-lg">
					Projeler ({projects.length})
				</h1>
				<div className="mt-10 flex flex-wrap gap-5">
					{projects &&
						projects.map((project, key) => (
							<Card key={key} project={project} />
						))}
				</div>
			</div>
		</PageHOC>
	)
}

export default Home
