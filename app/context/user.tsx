import * as React from "react"
import { User, UserContextType } from "../types"

export const UserContext = React.createContext<UserContextType | null>(null)

export const UserProvider: React.FC<any> = ({ children, solana }) => {
	const [user, setUser] = React.useState<string>("")

	const connectWallet = async () => {
		if (solana) {
			const response = await solana.connect()

			setUser(response.publicKey.toString())
		}
	}

	const disconnectWallet = async () => {
		if (solana) {
			await solana.disconnect()
			setUser("")
		}
	}

	const removeAddress = () => {
		setUser("")
	}

	return (
		<UserContext.Provider
			value={{ user, removeAddress, connectWallet, disconnectWallet }}
		>
			{children}
		</UserContext.Provider>
	)
}

export const useUser = () => React.useContext(UserContext) as UserContextType
