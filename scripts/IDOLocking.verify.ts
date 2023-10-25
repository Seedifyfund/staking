const hre = require("hardhat");
import * as dotenv from "dotenv";
dotenv.config();

// npx hardhat run scripts/IDOLocking.verify.ts --network bscTest
async function main() {
  await hre.run("verify:verify", {
    address: "0xB4B5dc840F1ae81920c36a5DFb7bD8Eb15d089C3",
    // see: https://hardhat.org/hardhat-runner/plugins/nomiclabs-hardhat-etherscan#using-programmatically
    constructorArguments: [
      process.env.NAME,
      process.env.TOKEN_ADDR,
      process.env.RATE,
      process.env.LOCK_DURATION,
    ],
  });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
