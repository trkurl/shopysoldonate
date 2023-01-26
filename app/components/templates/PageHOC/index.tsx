import React from "react"
import { Navbar, Sidebar } from "../../organisms"
import "react-toastify/dist/ReactToastify.css"
import { useProject } from "../../../context"
import Image from "next/image"
import Head from "next/head"
import { Modal } from "../../molecules"

const PageHOC = ({ children }: any) => {
	const { loader } = useProject()

	return (
		<>
			<Head>
				<link rel="shortcut icon" href="/favicon.ico" />
			</Head>
			<div className={`bg-[#13111C] w-screen h-auto flex justify-between`}>
				<div className="w-[5vw]">
					<Sidebar />
				</div>
				<div className="flex flex-col w-[80vw] mx-auto py-5">
					<Navbar />
					{loader ? (
						<div className="flex text-white justify-center items-center w-full h-full">
							<Image
								src="./spinner.svg"
								width={100}
								height={100}
								alt="loader"
							/>
						</div>
					) : (
						children
					)}
				</div>
			</div>
		</>
	)
}

export default PageHOC
