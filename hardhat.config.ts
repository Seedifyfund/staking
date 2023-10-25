import fs from "fs";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-preprocessor";
import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";

// use .env vars
import * as dotenv from "dotenv";
dotenv.config();

const mnemonic = process.env.SEED;
const BSC_RPC = process.env.BSC_RPC;
const BSC_KEY = process.env.BSC_KEY;

const SEPOLIA_RPC = process.env.SEPOLIA_RPC;
const chainId = process.env.chainId;
const ETH_RPC = process.env.ETH_RPC;

const ARB_RPC = process.env.ARB_RPC;
const ARB_MAIN_RPC = process.env.ARB_MAIN_RPC;
const ARB_KEY = process.env.ARB_KEY;

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545/",
    },
    hardhat: {},
    eth: {
      url: ETH_RPC,
      chainId: 1,
      accounts: { mnemonic },
    },
    arb: {
      url: ARB_MAIN_RPC,
      chainId: 42161,
      accounts: { mnemonic },
    },
    bscTest: {
      url: BSC_RPC,
      chainId: 97,
      gasPrice: 20000000000,
      accounts: { mnemonic },
    },
    sepolia: {
      url: SEPOLIA_RPC,
      chainId: 11155111,
      gasPrice: 20000000000,
      accounts: { mnemonic },
    },
    arbGoerli: {
      url: ARB_RPC,
      chainId: 421613,
      gasPrice: 20000000000,
      accounts: { mnemonic },
    },
  },
  etherscan: {
    apiKey: BSC_KEY,
  },
  solidity: {
    compilers: [
      {
        version: "0.8.9",
        settings: {
          optimizer: {
            enabled: true,
            runs: 20000,
          },
        },
      },
      {
        version: "0.5.16",
        settings: {
          optimizer: {
            enabled: true,
            runs: 20000,
          },
        },
      },
    ],
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  mocha: {
    timeout: 20000,
  },
};

export default config;
