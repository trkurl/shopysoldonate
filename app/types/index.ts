import { BN } from "@project-serum/anchor"
import { PublicKey } from "@solana/web3.js"

export interface Project {
	pubkey?: PublicKey
	name: string
	goal: BN
	donatedAmount?: BN
	auth?: PublicKey
	donations?: BN[]
	donators?: PublicKey[]
	deadline: BN
}

export interface ProjectContextType {
	currentProject: Project
	projects: Project[]
	loader: boolean
	createProject: () => Promise<void>
	getAllProjects: () => Promise<void>
	updateProject: (project: Partial<Project>) => void
	addProjects: (projects: Project[]) => void
	getMyProjects: (user: string) => Project[]
	donateToProject: (amount: number) => Promise<void>
	withdraw: (publicKey: PublicKey) => Promise<void>
	filterProject: (search: string) => void
}

export interface User {
	walletAddress: string
}

export interface UserContextType {
	user: string
	connectWallet: () => void
	removeAddress: () => void
	disconnectWallet: () => void
}

export * from "./solana_crodfunding"

export interface UiContexType {
	loader: boolean
	toggleLoader: () => void
}
