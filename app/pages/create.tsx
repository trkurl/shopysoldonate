import { LAMPORTS_PER_SOL } from "@solana/web3.js"
import { BN } from "bn.js"
import Head from "next/head"
import Image from "next/image"
import React, { useEffect, useState } from "react"
import { money } from "../assets"
import { Button, InputContainer, PageHOC } from "../components"
import { COLORS } from "../constants"
import { emptyProject, useProject, useUser } from "../context"

const Create = () => {
	const { createProject, updateProject, currentProject } = useProject()
	const { user } = useUser()

	const [date, setDate] = useState("")

	useEffect(() => {
		const dateString = new Date(currentProject.deadline.toNumber() * 1000)
			.toLocaleDateString()
			.split("/")
		setDate(`${dateString[2]}-${dateString[1]}-${dateString[0]}`)
	}, [currentProject.deadline])

	useEffect(() => {
		return () => {
			updateProject({ ...emptyProject })
		}
	}, [])

	return (
		<PageHOC>
			<Head>
				<title>Proje Fonlaması Oluştur</title>
			</Head>
			<div
				className={`flex flex-col gap-5 justify-start px-[2rem] py-5 items-center w-full bg-[${COLORS.secondaryBg}] h-[80%] my-auto rounded-lg`}
			>
				<div className="bg-[#44414B] p-5 w-[25%] mb-5 text-white text-center text-2xl rounded-lg">
				Proje Fonlaması Oluştur <span className="ml-4">🚀</span>
				</div>
				<div className="w-full flex gap-10 justify-between items-center my-5">
					<InputContainer
						value={currentProject.name}
						title="Proje İsmi"
						required
						placeholder="Solana Marketplace '"
						onChange={(e: any) => updateProject({ name: e.target.value })}
					/>
					<InputContainer
						value={user}
						title="Cüzdan Sahibinin Addresi"
						placeholder="0xabc...xyz"
					/>		
				</div>
				<div className="w-full flex gap-10 justify-between items-center my-5">
					<InputContainer
						value={`${currentProject.goal.toNumber()}`}
						title="Hedeflenen Fon Miktarı"
						required
						placeholder="1 Sol."
						onChange={(e: any) =>
							updateProject({ goal: new BN(e.target.value) })
						}
					/>
					<div className="flex flex-col items-start w-full">
						<h5 className={`text-[#69676F] mb-2`}>Fonlama Bitiş Tarihi</h5>
						<input
							className={`rounded-md border-[0.05rem] placeholder-[#69676F] border-[#69676F] w-full text-white focus:outline-none bg-[#211E29] h-10 py-2 px-5`}
							placeholder={"Deadline"}
							type="date"
							value={date}
							onChange={(e) =>
								updateProject({
									deadline: new BN(new Date(e.target.value).getTime() / 1000),
								})
							}
						/>
					</div>
				</div>
				<div className="w-full flex items-center gap-5 my-5 rounded-md bg-[#8D6DEB] py-5 px-5">
					<span className="inline-block">
						<Image
							src={money}
							width={30}
							height={30}
							alt="money"
							className="inline-block"
						/>
					</span>
					<h1 className="text-white font-semibold text-xl">
						Fonlamanın tamamı hesabınıza aktarılacaktır 💯 .
					</h1>
				</div>
				<div className="flex justify-end w-full my-5">
					<Button onClick={() => createProject()} label="Oluştur" />
				</div>
			</div>
		</PageHOC>
	)
}

export default Create
