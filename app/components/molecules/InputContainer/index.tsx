import React from "react"
import { Input } from "../../atoms"

type Props = {
	title: string
	required?: boolean
	placeholder: string
	className?: string
	value: string
	onChange?: any
	type?: string
}

const InputContainer = ({
	required,
	title,
	placeholder,
	className,
	value,
	onChange,
	type = "text",
}: Props) => {
	return (
		<div className="flex flex-col items-start w-full">
			<h5 className={`text-[#69676F] mb-2`}>
				{title} <span>{required && "*"}</span>
			</h5>
			<Input
				onChange={onChange}
				value={value}
				placeholder={placeholder}
				type={type}
				className="rounded-md w-full border-[0.05rem] placeholder-[#69676F] border-[#69676F]"
			/>
		</div>
	)
}

export default InputContainer
