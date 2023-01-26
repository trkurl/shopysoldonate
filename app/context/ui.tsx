import * as React from "react"
import { UiContexType } from "../types"

export const UiContext = React.createContext<UiContexType | null>(null)

export const UiProvider: React.FC<any> = ({ children }) => {
	const [loader, setLoader] = React.useState<boolean>(false)

	const toggleLoader = () => {
		setLoader((prev) => !prev)
	}

	return (
		<UiContext.Provider value={{ loader, toggleLoader }}>
			{children}
		</UiContext.Provider>
	)
}

export const useUi = () => React.useContext(UiContext) as UiContexType
