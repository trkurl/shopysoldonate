import { PublicKey } from "@solana/web3.js"

export const shortAddress = (pubkey: PublicKey) => {
	return pubkey.toBase58().slice(0, 6) + "..." + pubkey.toBase58().slice(-6)
}
