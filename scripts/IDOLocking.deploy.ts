import hre from "hardhat";
import { ethers } from "hardhat";
import * as dotenv from "dotenv";
// dotenv.config();

const NAME = "SWTEST 1h";
const NAME1 = "SWTEST 4h";
const NAME2 = "SWTEST 8h";
const NAME3 = "SWTEST 1d";

const TOKEN_ADDR = "0x3f274117f86808D7682BB313Fa31a1583c5028Aa";
const RATE = 1;
const LOCK_DURATION = 0;

// npx hardhat run scripts/IDOLocking.deploy.ts --network bscTest
async function main() {
  for (const name of [NAME, NAME1, NAME2, NAME3]) {
    const idoLocking = await ethers.deployContract("IDOLocking", [
      name,
      TOKEN_ADDR,
      RATE,
      LOCK_DURATION,
    ]);

    await idoLocking.deployTransaction.wait();

    console.log(
      `IDOLocking ${await idoLocking.name()} deployed to ${idoLocking.address}`
    );

    await hre.run("verify:verify", {
      address: idoLocking.address,
      // see: https://hardhat.org/hardhat-runner/plugins/nomiclabs-hardhat-etherscan#using-programmatically
      constructorArguments: [name, TOKEN_ADDR, RATE, LOCK_DURATION],
    });
    console.log("\n\n\n");
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
