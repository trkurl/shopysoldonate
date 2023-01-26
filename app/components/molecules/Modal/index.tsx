import Link from "next/link"
import React from "react"
import { COLORS } from "../../../constants"

const Modal = () => {
	return (
		<div
			className={`bg-[${COLORS.background}] flex justify-center items-center h-screen w-screen`}
		>
			<div
				className={`bg-[${COLORS.secondaryBg}] rounded-lg flex justify-start items-center p-10 flex-col w-[30%] h-[30%]`}
			>
				<h1 className={`text-[${COLORS.primary}] text-center text-2xl my-10`}>
					Opps. You cannot use this app. 😕
				</h1>
				<p className="text-lg text-center text-[#8D6DEA]">
					You will have to install{" "}
					<span>
						<Link
							href="https://phantom.app/"
							className={`text-[${COLORS.primary}] underline `}
						>
							Phantom Wallet
						</Link>
					</span>{" "}
					for Solana to get started.
				</p>
			</div>
		</div>
	)
}

export default Modal
