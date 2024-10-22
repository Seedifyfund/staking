import hre, { ethers } from "hardhat";
import * as dotenv from "dotenv";
// dotenv.config();

const contracts = [
  "0xa1bfa531FB91F70266EB46ddb7efACDa5834eacE", // 90d
  "0x6E42F30e5163eeDcd329247574d432658c03B1C1", // 180d
  "0x2c0a82ba4Bd2869ba720937BFd6c59C2CB9bf33b", // 270d
  "0x90c5DaCE72DC178Ba8908173aDDC7d493F2b24B6", // 360d
];
const aprs = [10, 20, 25, 30];
const days = [90, 180, 270, 360];

function getRate(apr: number, lockDuration: number) {
  return ((apr * lockDuration) / 365) * 100;
}

// npx hardhat run scripts/IDOLocking.setRateAndLockduration.ts --network arb
async function main() {
  let name: string, apr: number, lockDuration: number, rate: number, roundDownRate: number;
  let idoLocking: any;

  for (let i = 0; i < contracts.length; i++) {
    idoLocking = contracts[i];
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
