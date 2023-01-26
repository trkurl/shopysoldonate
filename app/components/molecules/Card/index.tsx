import { LAMPORTS_PER_SOL } from "@solana/web3.js"
import React, { useEffect } from "react"
import { Project } from "../../../types"
import { Button } from "../../atoms"
import { shortAddress } from "../../../utils"
import { useRouter } from "next/router"
import { emptyProject, useProject, useUser } from "../../../context"

type Props = {
	project: Project
}

const Card = ({ project }: Props) => {
	const { push, route } = useRouter()
	const { withdraw } = useProject()

	const onClick = async () => {
		if (route !== "/profile") {
			await push(`/project?key=${project.pubkey?.toBase58()}`)
		} else {
			await withdraw(project.pubkey!)
		}
	}

	return (
		<div className="flex flex-col bg-[#211E29] justify-start gap-5 items-start py-5 px-3 w-[17rem] h-[17rem] rounded-md">
			<h1 className="text-xl text-white">{project.name}</h1>
			<div className="flex flex-col gap-1 w-[95%] m-auto">
				<div className="flex justify-between gap-2">
					<div className="flex justify-start gap-2">
						<p className="text-slate-400">
							{project.goal.toNumber() / LAMPORTS_PER_SOL} SOL
						</p>
					</div>
					<div className="text-slate-400">Bitiş Tarihi</div>
				</div>
				<div className="flex justify-between gap-2">
					<p className="text-gray-600">
						Yatırılan: {project.donatedAmount!.toNumber() / LAMPORTS_PER_SOL} SOL
					</p>
					<div className="flex flex-col">
						<p className="text-gray-600">
							{
								new Date(project.deadline.toNumber() * 1000)
									.toISOString()
									.split("T")[0]
							}
						</p>
					</div>
				</div>
				<div className="w-full flex justify-center">
					<Button
						onClick={() => onClick()}
						label={`${route === "/profile" ? "Withdraw" : "İncele"}`}
						className={`my-5 ${route === "/profile" && `bg-[#8D6DEA]`}`}
					/>
				</div>
				<h1 className="text-white text-lg text-center">
					0x{shortAddress(project.auth!)}
				</h1>
			</div>
		</div>
	)
}

export default Card
