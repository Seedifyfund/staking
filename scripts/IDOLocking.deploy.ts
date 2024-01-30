const hre = require("hardhat");
import { ethers } from "hardhat";
import * as dotenv from "dotenv";
dotenv.config();

const NAME = process.env.NAME;
const TOKEN_ADDR = process.env.TOKEN_ADDR;
const RATE = process.env.RATE;
const LOCK_DURATION = process.env.LOCK_DURATION;

// npx hardhat run scripts/IDOLocking.deploy.ts --network bscTest
async function main() {
  const idoLocking = await ethers.deployContract("IDOLocking", [
    NAME,
    TOKEN_ADDR,
    RATE,
    LOCK_DURATION,
  ]);

  await idoLocking.deployTransaction.wait();

  console.log(`IDOLocking deployed to ${idoLocking.address}`);

  await hre.run("verify:verify", {
    address: idoLocking.address,
    // see: https://hardhat.org/hardhat-runner/plugins/nomiclabs-hardhat-etherscan#using-programmatically
    constructorArguments: [NAME, TOKEN_ADDR, RATE, LOCK_DURATION],
  });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
