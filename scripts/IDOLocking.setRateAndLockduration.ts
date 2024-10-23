import hre, { ethers } from "hardhat";
import * as dotenv from "dotenv";
// dotenv.config();

import contracts from "./contractAddrs";

const aprs = [10, 20, 25, 30];
const days = [90, 180, 270, 360];

function getRate(apr: number, lockDuration: number) {
  return ((apr * lockDuration) / 365) * 100;
}

// npx hardhat run scripts/IDOLocking.setRateAndLockduration.ts --network arb
async function main() {
  let name: string, apr: number, lockDuration: number, rate: number, roundDownRate: number;
  let idoLocking: any;

  for (let i = 0; i < contracts[hre.network.name].length; i++) {
    idoLocking = contracts[hre.network.name][i];
    apr = aprs[i];
    lockDuration = days[i];
    rate = getRate(apr, lockDuration);
    roundDownRate = Math.floor(rate);

    idoLocking = await ethers.getContractAt("IDOLocking", idoLocking);
    await idoLocking.setRateAndLockduration(roundDownRate, lockDuration * 24);

    console.log(
      `${await idoLocking.name()} at ${idoLocking.address}, on-chain rate updated to ${roundDownRate} for ${apr}% APR \n`
    );
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
