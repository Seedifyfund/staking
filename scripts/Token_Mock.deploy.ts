import { ethers } from "hardhat";
import * as dotenv from "dotenv";
dotenv.config();

// npx hardhat run scripts/Token_Mock.deploy.ts --network sepolia
async function main() {
  const farming = await ethers.deployContract("Token_Mock", []);

  console.log(`Token_Mock deployed to ${farming.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
