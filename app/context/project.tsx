import { AnchorProvider, BN, Program, utils, web3 } from "@project-serum/anchor"
import {
	clusterApiUrl,
	Connection,
	LAMPORTS_PER_SOL,
	PublicKey,
	SystemProgram,
} from "@solana/web3.js"
import { useRouter } from "next/router"
import * as React from "react"
import { useEffect } from "react"
import { toast } from "react-toastify"
import { IDL } from "../data"
import { Project, ProjectContextType, SolanaCrowdfunding } from "../types"
import { useUi } from "./ui"

export const ProjectContext = React.createContext<ProjectContextType | null>(
	null
)

export const emptyProject = {
	name: "",
	goal: new BN(0),
	deadline: new BN(Date.now() / 1000),
	donations: [],
	donators: [],
	donatedAmount: new BN(0),
}

export const ProjectProvider: React.FC<any> = ({ children, solana }) => {
	const { query, route } = useRouter()

	const [currentProject, setCurrentProject] = React.useState<Project>({
		...emptyProject,
	})
	const [projects, setProjects] = React.useState<Project[]>([])
	const [flag, setFlag] = React.useState(false)
	const [loader, setLoader] = React.useState(false)

	const connection = new Connection(clusterApiUrl("devnet"), "processed")
	const getProvider = () => {
		const provider = new AnchorProvider(
			connection,
			solana,
			AnchorProvider.defaultOptions()
		)
		return provider
	}
	const provider = getProvider()

	const program = new Program<SolanaCrowdfunding>(
		IDL,
		IDL.metadata.address,
		provider
	)

	useEffect(() => {
		getAllProjects()
	}, [flag])

	useEffect(() => {
		if (route === "/project") {
			setLoader((prev) => !prev)
			getProject()
			setLoader((prev) => !prev)
		}
	}, [route])

	useEffect(() => {
		const getCurrentProject = async () => {
			const project = await program.account.project.fetch(
				new web3.PublicKey(query.key!)
			)
			setCurrentProject({ ...project, pubkey: new PublicKey(query.key!) })
		}
		if (query.key && route === "/project") {
			setLoader((prev) => !prev)
			getCurrentProject()
			setLoader((prev) => !prev)
		}
	}, [query, flag])

	const createProject = async () => {
		setLoader((prev) => !prev)
		try {
			if (!provider.wallet.publicKey) {
				setLoader((prev) => !prev)
				toast.error("You are not logged in.")
				return
			}
			const project = await PublicKey.findProgramAddress(
				[utils.bytes.utf8.encode("seed"), provider.wallet.publicKey.toBuffer()],
				program.programId
			)

			const pro = projects.filter(
				(pro) => pro.pubkey?.toBase58() === project[0].toBase58()
			)

			if (pro.length > 0) {
				setLoader((prev) => !prev)
				toast.error("You can only have one campaign at a time.")
				return
			}

			const { name, goal, deadline } = currentProject

			const g = goal.toNumber() * LAMPORTS_PER_SOL

			await program.rpc.create(new BN(g), deadline, name, {
				accounts: {
					project: project[0],
					user: provider.wallet.publicKey,
					systemProgram: SystemProgram.programId,
				},
			})
			setFlag((prev) => !prev)
		} catch (error: any) {
			toast.error(
				error.error && error.error.errorMessage
					? error.error.errorMessage
					: "Something went wrong!"
			)
			console.error("Error for this function:", error)
		}
	}

	const getAllProjects = async () => {
		setLoader((prev) => !prev)
		try {
			const projects = await Promise.all(
				(
					await connection.getProgramAccounts(
						new PublicKey(IDL.metadata.address)
					)
				).map(async (project) => ({
					...(await program.account.project.fetch(project.pubkey)),
					pubkey: project.pubkey,
				}))
			)
			setProjects(projects)
		} catch (error: any) {
			toast.error("Something went wrong!")
			console.error("Error creating project account:", error)
		}
		setLoader((prev) => !prev)
	}

	const updateProject = (project: Partial<Project>) => {
		setCurrentProject((prev) => ({ ...prev, ...project }))
	}

	const filterProject = (search: string) => {
		if (search === "") {
			getAllProjects()
		}
		setProjects(projects.filter((pro) => pro.name.startsWith(search)))
	}

	const addProjects = (projects: Project[]) => {
		setProjects(projects)
	}

	const getMyProjects = (user: string) => {
		return projects.filter((project) => project.auth?.toBase58() === user)
	}

	const getProject = () => {
		const project = projects.filter(
			(project) => project.pubkey?.toBase58() === query.key
		)[0]

		setCurrentProject(project)
	}

	const donateToProject = async (amount: number) => {
		setLoader((prev) => !prev)
		try {
			if (!provider.wallet.publicKey) {
				setLoader((prev) => !prev)
				toast.error("You are not logged in.")
				return
			}
			await program.rpc.donate(new BN(amount * LAMPORTS_PER_SOL), {
				accounts: {
					project: currentProject.pubkey!,
					user: provider.wallet.publicKey,
					systemProgram: SystemProgram.programId,
				},
			})
			toast.success(
				`You have successfully donated ${amount} SOL to the project.`
			)
		} catch (error: any) {
			toast.error(
				error.error && error.error.errorMessage
					? error.error.errorMessage
					: "Something went wrong!"
			)
			console.error("Error for this function:", error)
		}
		setLoader((prev) => !prev)
	}

	const withdraw = async (publicKey: PublicKey) => {
		setLoader((prev) => !prev)
		try {
			await program.rpc.withdraw({
				accounts: {
					project: publicKey,
					user: provider.wallet.publicKey,
				},
			})
			toast.success(
				`You have successfully withdrawn SOL donated and ended the project.`
			)
		} catch (error: any) {
			toast.error(
				error.error && error.error.errorMessage
					? error.error.errorMessage
					: "Something went wrong!"
			)
			console.error("Error for this function:", error)
		}
		setLoader((prev) => !prev)
	}

	return (
		<ProjectContext.Provider
			value={{
				projects,
				currentProject,
				loader,
				createProject,
				getAllProjects,
				getMyProjects,
				updateProject,
				addProjects,
				donateToProject,
				withdraw,
				filterProject,
			}}
		>
			{children}
		</ProjectContext.Provider>
	)
}

export const useProject = () =>
	React.useContext(ProjectContext) as ProjectContextType
