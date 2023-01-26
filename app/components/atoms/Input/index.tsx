import React, { HTMLInputTypeAttribute } from "react"
import { InputType } from "zlib"
import { COLORS } from "../../../constants"

interface Props {
	type?: string
	placeholder: string
	className?: string
	value: string
	onChange: any
}

const Input = ({
	onChange,
	placeholder,
	className,
	type = "text",
	value,
}: Props) => {
	return (
		<input
			value={value}
			className={`w-full text-white focus:outline-none bg-[#211E29] h-10 py-2 px-5 rounded-3xl ${className}`}
			placeholder={placeholder}
			type={type}
			onChange={onChange}
		/>
	)
}

export default Input
