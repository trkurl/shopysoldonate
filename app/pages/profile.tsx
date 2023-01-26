import Head from "next/head"
import React, { useEffect, useState } from "react"
import { Card, PageHOC } from "../components"
import { useProject, useUser } from "../context"
import { Project } from "../types"

type Props = {}

const Profile = (props: Props) => {
	const { getMyProjects } = useProject()
	const { user } = useUser()

	const [projects, setProjects] = useState<Project[]>([])

	useEffect(() => {
		setProjects(getMyProjects(user))
	}, [user])

	return (
		<PageHOC>
			<Head>
				<title>Profilim</title>
			</Head>
			<div className="w-full h-full flex flex-col justify-start mt-2">
				<h1 className="text-white font-bold text-lg">
					Projelerim ({projects!.length})
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

export default Profile
