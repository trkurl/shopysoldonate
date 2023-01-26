import * as anchor from "@project-serum/anchor"
import { Program } from "@project-serum/anchor"
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js"
import { SolanaCrowdfunding } from "../target/types/solana_crowdfunding"
import privatekey from "../keypair/keypair.json"
import donorkey from "../keypair/donor.json"
import { expect } from "chai"

function stringToUint(seed: String) {
	return Uint8Array.from(seed.split("").map((x) => x.charCodeAt(0)))
}

describe("solana-crowdfunding", () => {
	const GOAL = 0.001 * LAMPORTS_PER_SOL
	const DEADLINE = Date.now() / 1000

	anchor.setProvider(anchor.AnchorProvider.local())

	const owner = anchor.web3.Keypair.fromSecretKey(new Uint8Array(privatekey))

	const program = anchor.workspace
		.SolanaCrowdfunding as Program<SolanaCrowdfunding>

	const returnPDA = async () => {
		return await PublicKey.findProgramAddress(
			[stringToUint("seed"), owner.publicKey.toBuffer()],
			program.programId
		).then((res) => res[0])
	}

	const createProject = async () => {
		const pda = await returnPDA()
		await program.methods
			.create(new anchor.BN(GOAL), new anchor.BN(DEADLINE), "Title")
			.accounts({
				project: pda,
				systemProgram: anchor.web3.SystemProgram.programId,
			})
			.signers([owner])
			.rpc()
	}

	const donate1Sol = async (signer: anchor.web3.Keypair = owner) => {
		const pda = await returnPDA()
		await program.methods
			.donate(new anchor.BN(0.001 * LAMPORTS_PER_SOL))
			.accounts({
				project: pda,
			})
			.signers([signer])
			.rpc()
	}

	const withdraw = async () => {
		const pda = await returnPDA()
		await program.methods
			.withdraw()
			.accounts({
				project: pda,
			})
			.signers([owner])
			.rpc()
	}

	it("can create a new project", async () => {
		const pda = await returnPDA()
		await createProject()

		const data = await program.account.project.fetch(pda)

		expect(data.goal.toNumber()).to.be.equal(GOAL)
		expect(data.name).to.be.equal("Title")
		expect(data.auth.toBase58()).to.be.equal(owner.publicKey.toBase58())
		expect(data.donatedAmount.toNumber()).to.be.equal(0)
	})

	it("can donate sol to a project", async () => {
		const pda = await returnPDA()
		await donate1Sol()

		const data = await program.account.project.fetch(pda)

		expect(data.donatedAmount.toNumber()).to.be.equal(0.001 * LAMPORTS_PER_SOL)
	})

	it("should let owner withdraw the funds", async () => {
		const balance = await program.provider.connection.getBalance(
			owner.publicKey
		)

		await withdraw()

		const balance1 = await program.provider.connection.getBalance(
			owner.publicKey
		)

		expect(balance1).to.be.gt(balance)
	})
})
