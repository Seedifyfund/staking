import hre, { ethers } from "hardhat";
import * as dotenv from "dotenv";
// dotenv.config();

const names = [
  "Staking 90 days - Seedworld",
  "Staking 180 days - Seedworld",
  "Staking 270 days - Seedworld",
  "Staking 360 days - Seedworld",
];
const aprs = [10, 20, 25, 30];
const days = [90, 180, 270, 360];

const TOKEN_ADDR = "0x968bE3F7bfeF0F8eDc3c1aD90232EbB0DA0867aA"; // Seedworld

function getRate(apr: number, lockDuration: number) {
  return ((apr * lockDuration) / 365) * 100;
}

// npx hardhat run scripts/IDOLocking.deploy.ts --network arb
async function main() {
  let name: string, apr: number, lockDuration: number, rate: number, roundDownRate: number;
  let currentBlock: number;
  let idoLocking: any;
  for (let i = 0; i < names.length; i++) {
    name = names[i];
    apr = aprs[i];
    lockDuration = days[i];
    rate = getRate(apr, lockDuration);
    roundDownRate = Math.floor(rate);

    name = `${name}, ${apr}% APR`;

    idoLocking = await ethers.deployContract("IDOLocking", [
      name,
      TOKEN_ADDR,
      roundDownRate,
      lockDuration * 24,
    ]);

    console.log("Waiting for 5 blocks...");
    currentBlock = await ethers.provider.getBlockNumber();
    while (currentBlock + 5 > (await ethers.provider.getBlockNumber())) {}

    console.log(`5 blocks later, ${name} deployed to: `, idoLocking.address);
    console.log(`round down rate: ${roundDownRate}`);

    await hre.run("verify:verify", {
      address: idoLocking.address,
      // see: https://hardhat.org/hardhat-runner/plugins/nomiclabs-hardhat-etherscan#using-programmatically
      constructorArguments: [name, TOKEN_ADDR, rate, lockDuration * 24],
    });
    console.log("\n\n");
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
