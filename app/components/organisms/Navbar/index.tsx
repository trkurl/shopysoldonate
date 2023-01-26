import { PublicKey } from "@solana/web3.js"
import Image from "next/image"
import React, { useEffect, useState } from "react"
import { search } from "../../../assets"
import { useProject, useUser } from "../../../context"
import { shortAddress } from "../../../utils"
import { Button, Input } from "../../atoms"

type Props = {}

const Navbar = (props: Props) => {
	const { connectWallet, user } = useUser()
	const { filterProject } = useProject()

	const [searchTerm, setSearch] = useState("")

	useEffect(() => {
		if (searchTerm === "") filterProject("")
	}, [searchTerm])

	return (
		<div className="flex justify-between items-center w-full py-5">
			<div className="w-1/2 flex justify-start items-center">
				<div className="w-2/5">
					<Input
						value={searchTerm}
						onChange={(e: any) => setSearch(e.target.value)}
						className="rounded-r-none"
						placeholder="Arama..."
					/>
				</div>
				<div
					className={`bg-[#59CF9A] p-2 rounded-l-none w-[3.5rem] h-9 cursor-pointer rounded-full`}
				>
					<Image
						src={search}
						width={20}
						height={20}
						alt="search"
						className="m-auto"
						onClick={() => filterProject(searchTerm)}
					/>
				</div>
			</div>
			<div className="w-1/2 flex justify-end">
				<Button
					onClick={() => connectWallet()}
					label={user ? shortAddress(new PublicKey(user)) : "Cüzdan Bağla"}
				/>
			</div>
		</div>
	)
}

export default Navbar
