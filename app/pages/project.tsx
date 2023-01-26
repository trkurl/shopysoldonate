import { LAMPORTS_PER_SOL } from "@solana/web3.js"
import Head from "next/head"
import React, { useState } from "react"
import { Button, Input, PageHOC } from "../components"
import { COLORS } from "../constants"
import { useProject } from "../context"
import { shortAddress } from "../utils"

const Project = () => {
	const { currentProject, donateToProject } = useProject()

	const [fund, setFund] = useState("")

	return (
		<PageHOC>
			<Head>
				<title>{currentProject.name}</title>
			</Head>
			<div className="flex flex-col mt-5">
				<h1 className="text-white text-3xl mb-10">
					{currentProject && currentProject.name}
				</h1>
				<div className="flex flex-row justify-between items-start gap-5">
					<div className="flex flex-col gap-5 w-[70%]">
						<div
							className={`bg-[${COLORS.secondaryBg}] rounded-lg p-5  flex flex-col gap-3`}
						>
							<h1 className="text-white text-lg">Proje Sahibi</h1>
							<p className={`text-md text-[#59CF9A]`}>
								0x{currentProject && currentProject.auth?.toBase58()}
							</p>
						</div>
						<div
							className={`bg-[${COLORS.secondaryBg}] rounded-lg p-5 flex flex-col gap-3`}
						>
							<h1 className="text-white text-lg">Yatırımcılar</h1>
							{currentProject && currentProject.donations!.length > 0 ? (
								currentProject.donations!.map((donation, ind) => (
									<div key={ind} className="flex gap-2">
										<p className={`text-md text-white`}>
											{donation.toNumber() / LAMPORTS_PER_SOL}
										</p>
										<p className="text-md text-gray-500">
											{shortAddress(currentProject.donators![ind])}
										</p>
									</div>
								))
							) : (
								<p className="text-lg text-gray-500">Henüz Fonlama Yapılmadı. 🙁</p>
							)}
						</div>
						<div
							className={`bg-[${COLORS.secondaryBg}] rounded-lg p-5 flex flex-col gap-3 items-center`}
						>
							<h1 className="text-white text-start w-full text-lg">Projeye Destek Sağla</h1>
							<h1 className="text-gray-500 text-md text-center">
								Biraz SOL Bağışla
							</h1>
							<Input
								value={fund}
								onChange={(e: any) => setFund(e.target.value)}
								placeholder="SOL"
								type="number"
								className="rounded-sm border-[0.05rem] placeholder-[#69676F] border-[#69676F]"
							/>
							<div className="w-full flex flex-col items-start gap-2 my-5 rounded-md bg-[#8D6DEB] py-5 px-5">
								<h1 className="text-white">Projeye İnan.</h1>
								<p className="text-slate-300">
									Solana Ağında Görmek İstediğiniz Projelere Fon Sağlayın.
								</p>
							</div>

							<Button
								label="Fonlama"
								className="w-[70%]"
								onClick={async () => {
									await donateToProject(parseFloat(fund))
									setFund("")
								}}
							/>
						</div>
					</div>
					<div className="w-[20%] flex flex-col gap-5">
						<div
							className={`bg-[${COLORS.secondaryBg}] rounded-lg p-5 flex flex-col gap-3`}
						>
							<h1 className="text-white text-lg">Fonlama Bitiş Tarihi</h1>
							<p className={`text-md text-[#59CF9A]`}>
								{
									new Date(
										currentProject
											? currentProject.deadline.toNumber() * 1000
											: Date.now()
									)
										.toISOString()
										.split("T")[0]
								}
							</p>
						</div>
						<div
							className={`bg-[${COLORS.secondaryBg}] rounded-lg p-5 flex flex-col gap-3`}
						>
							<h1 className="text-white text-lg">Hedeflenen Fon Miktarı</h1>
							<p className={`text-md text-[#59CF9A]`}>
								{currentProject &&
									currentProject.goal.toNumber() / LAMPORTS_PER_SOL}
							</p>
						</div>
						<div
							className={`bg-[${COLORS.secondaryBg}] rounded-lg p-5 flex flex-col gap-3`}
						>
							<h1 className="text-white text-sm">Yatırılan</h1>
							<p className={`text-md text-[#59CF9A]`}>
								{currentProject &&
									currentProject.donatedAmount!.toNumber() / LAMPORTS_PER_SOL}
							</p>
						</div>
					</div>
				</div>
			</div>
		</PageHOC>
	)
}

export default Project
