import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Token1__factory, Token1 } from "../typechain-types";

describe("Token contract", function () {

	let Token1: Token1;
	let owner: SignerWithAddress;
	let addr1: SignerWithAddress;
	let addr2: SignerWithAddress
	let treasury: SignerWithAddress
	let addrs: SignerWithAddress[];

	beforeEach(async function () {

		[owner, addr1, addr2, treasury, ...addrs] = await ethers.getSigners();

		const Token1Factory = (await ethers.getContractFactory(
			"Token1", owner
		)) as Token1__factory;
	
		Token1 = await Token1Factory.deploy()
		await Token1.deployed()

 
	});

	describe("Deployment", function () {

		it("Should assign the initial supply of tea tokens to the treasury", async function () {
			const treasuryBalance = await Token1.balanceOf(treasury.address);
			expect(await Token1.totalSupply()).to.equal('3000000000000000000000000');
		});
	});

	// describe("Transactions", function () {
	// 	it("Should transfer tokens between accounts", async function () {
	// 		// Transfer 50 tokens from owner to addr1
	// 		await Token1.transfer(addr1.address, 50);
	// 		const addr1Balance = await Token1.balanceOf(addr1.address);
	// 		expect(addr1Balance).to.equal(50);

	// 		// Transfer 50 tokens from addr1 to addr2
	// 		// We use .connect(signer) to send a transaction from another account
	// 		await Token1.connect(addr1).transfer(addr2.address, 50);
	// 		const addr2Balance = await Token1.balanceOf(addr2.address);
	// 		expect(addr2Balance).to.equal(50);
	// 	});

	// 	it("Should fail if sender doesn’t have enough tokens", async function () {
	// 		const initialOwnerBalance = await Token1.balanceOf(owner.address);

	// 		// Try to send 1 token from addr1 (0 tokens) to owner (1000 tokens).
	// 		// `require` will evaluate false and revert the transaction.
	// 		await expect(
	// 			Token1.connect(addr1).transfer(owner.address, 1)
	// 		).to.be.revertedWith("ERC20: transfer amount exceeds balance");

	// 		// Owner balance shouldn't have changed.
	// 		expect(await Token1.balanceOf(owner.address)).to.equal(
	// 			initialOwnerBalance
	// 		);
	// 	});

	// 	it("Should update balances after transfers", async function () {
	// 		const initialOwnerBalance = await Token1.balanceOf(owner.address);

	// 		// Transfer 100 tokens from owner to addr1.
	// 		await Token1.transfer(addr1.address, 100);

	// 		// Transfer another 50 tokens from owner to addr2.
	// 		await Token1.transfer(addr2.address, 50);

	// 		// Check balances.
	// 		const finalOwnerBalance = await Token1.balanceOf(owner.address);
	// 		expect(finalOwnerBalance).to.equal(initialOwnerBalance.sub(150));

	// 		const addr1Balance = await Token1.balanceOf(addr1.address);
	// 		expect(addr1Balance).to.equal(100);

	// 		const addr2Balance = await Token1.balanceOf(addr2.address);
	// 		expect(addr2Balance).to.equal(50);
	// 	});
	// });
});