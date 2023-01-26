import {
	createCampaign,
	dashboard,
	logout,
	payment,
	profile,
	withdraw,
} from "../assets"

export const SIDEBAROPTIONS = [
	{
		name: "dashboard",
		imgUrl: dashboard,
		link: "/",
	},
	{
		name: "create campaign",
		imgUrl: createCampaign,
		link: "/create",
	},
	// {
	// 	name: "payment",
	// 	imgUrl: payment,
	// 	link: "/",
	// 	disabled: true,
	// },
	// {
	// 	name: "withdraw",
	// 	imgUrl: withdraw,
	// 	link: "/",
	// 	disabled: true,
	// },
	{
		name: "profile",
		imgUrl: profile,
		link: "/profile",
	},
]
