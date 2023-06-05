import { ethers } from "hardhat";
import fs from 'fs';

const cids = JSON.parse(fs.readFileSync("ipfs/cids.json", 'utf8'));

async function main() {
  const SodasNFT = await ethers.getContractFactory("SodasNFT");
  const sodasNFT = await SodasNFT.deploy(cids);

  await sodasNFT.deployed();

  console.log(
    `SodasNFT deployed at ${sodasNFT.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
