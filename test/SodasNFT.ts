import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import fs from 'fs';

const cids = JSON.parse(fs.readFileSync("ipfs/cids.json", 'utf8'));

const random = (): number => {
	return Math.floor(Math.random() * 10);
}

describe("SodasNFT", function () {
	async function deployContract() {
		const factory = await ethers.getContractFactory("SodasNFT");
		const contract = await factory.deploy(cids);
		
		await contract.deployed();
		
		const [owner, account1] = await ethers.getSigners();
		
		return { contract, owner, account1 };
	}
	
	describe("Contract deployment", async () => {
		it("set owner correctly and", async () => {
			const { contract, owner } = await loadFixture(deployContract);
			
			expect(await contract.owner()).to.equal(owner.address);
			for (let i = 0; i < cids.length; i++) {
				expect((await contract.drinks(i)).cid).to.equal(cids[i]);
			}
		});
		
		it("rejects on drink and review", async () => {
			const { contract, owner } = await loadFixture(deployContract);
			
			await expect(contract.connect(owner).drink()).to.be.rejected;
			await expect(contract.connect(owner).review(true)).to.be.rejected;
		});
	});
	
	async function deployContractAndMint() {
		const { contract, owner, account1 } = await loadFixture(deployContract);
		
		const soda1 = random();
		await expect(contract.connect(account1).mint(soda1)).to.emit(contract, "Mint").withArgs(1);
		const tokenId1 = (await contract.tokenIdByAddress(account1.address)).tokenId;
		expect(tokenId1).to.equal(1);
		
		
		const soda2 = random();
		await expect(contract.connect(owner).mint(soda2)).to.emit(contract, "Mint").withArgs(2);
		const tokenId2 = (await contract.tokenIdByAddress(owner.address)).tokenId;
		expect(tokenId2).to.equal(2);
		
		return { contract, owner, account1, soda1, soda2, tokenId1, tokenId2 };
	}

	describe("Mint", () => {		
		it("minted sodas", async () => {
			const { contract, owner, account1, soda1, soda2 } = await loadFixture(deployContractAndMint);
			
			expect(await contract.balanceOf(account1.address)).to.equal(1);
			expect(await contract.balanceOf(owner.address)).to.equal(1);
			expect(await contract.tokenURIs(1)).to.contains(cids[soda1]);
			expect(await contract.tokenURIs(2)).to.contains(cids[soda2]);
		});
		
		it("reject if already have sodas", async () => {
			const { contract, owner, account1, soda1, soda2 } = await loadFixture(deployContractAndMint);
			
			await expect(contract.connect(owner).mint(random())).to.be.rejected;
		});
	});
	
	async function deployContractAndMintAndDrink() {
		const { contract, owner, account1, soda1, soda2, tokenId1, tokenId2 } = await loadFixture(deployContractAndMint);
		
		await expect(contract.connect(account1).drink()).to.emit(contract, "Drink").withArgs(1);
		await expect(contract.connect(owner).drink()).to.emit(contract, "Drink").withArgs(2);
		
		return { contract, owner, account1, soda1, soda2, tokenId1, tokenId2 };
	}
	
	describe("Drink", async () => {
		it("should drink their sodas", async () => {
			const { contract, owner, account1, tokenId1, tokenId2 } = await loadFixture(deployContractAndMintAndDrink);
			
			await expect(contract.ownerOf(tokenId1)).to.be.rejected;
		});
		
		it("should not drink twice", async () => {
			const { contract, owner, account1, tokenId1, tokenId2 } = await loadFixture(deployContractAndMintAndDrink);
			
			await expect(contract.connect(account1).drink()).to.be.rejected;
		})
	});
	
	async function deployContractAndMintAndDrinkAndReview() {
		const { contract, owner, account1, soda1, soda2 } = await loadFixture(deployContractAndMintAndDrink);
		
		await expect(contract.connect(account1).review(true)).to.emit(contract, "Review").withArgs(soda1);
		await expect(contract.connect(owner).review(false)).to.emit(contract, "Review").withArgs(soda2);
		
		return { contract, owner, account1, soda1, soda2 };
	}
	
	describe("Review", async () => {
		it("should review and gives score correctly", async () => {
			const { contract, owner, account1, soda1, soda2 } = await loadFixture(deployContractAndMintAndDrinkAndReview);
			
			expect((await contract.drinks(soda1)).score).to.equal(1);
			expect((await contract.drinks(soda2)).score).to.equal(0);
		});
	});
});
