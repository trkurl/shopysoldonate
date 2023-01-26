import "../styles/globals.css"
import type { AppProps } from "next/app"
import { ProjectContext, ProjectProvider, UserProvider } from "../context"
import { useEffect, useState } from "react"
import { ToastContainer } from "react-toastify"
import { COLORS } from "../constants"
import Link from "next/link"
import { Modal } from "../components"

declare global {
	interface Window {
		solana: any
	}
}

export default function App({ Component, pageProps }: AppProps) {
	const [solana, setSolana] = useState<any>()

	useEffect(() => {
		setSolana(window.solana)
	}, [])

	if (!solana) {
		return <Modal />
	}

	return (
		<UserProvider>
			<ProjectProvider solana={solana}>
				<UserProvider solana={solana}>
					<Component {...pageProps} />
					<ToastContainer />
				</UserProvider>
			</ProjectProvider>
		</UserProvider>
	)
}
