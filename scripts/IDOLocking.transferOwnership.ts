import hre, { ethers } from "hardhat";
import * as dotenv from "dotenv";
// dotenv.config();

import contracts from "./contractAddrs";

const newOwner = "0x560363BdA52BC6A44CA6C8c9B4a5FadbDa32fa60";


// npx hardhat run scripts/IDOLocking.transferOwnership.ts --network arb
async function main() {
  let idoLocking: any;

  for (let i = 0; i < contracts[hre.network.name].length; i++) {
    idoLocking = await ethers.getContractAt("IDOLocking", contracts[hre.network.name][i]);
    await idoLocking.transferOwnership(newOwner);

    console.log(`${await idoLocking.name()} at ${idoLocking.address} transferred to ${newOwner}`);
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
