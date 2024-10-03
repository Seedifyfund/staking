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

//////////////// mainnets ////////////////
const ARB_RPC = process.env.ARB_RPC;
const AVAX_RPC = process.env.AVAX_RPC;
const BASE_RPC = process.env.BASE_RPC;
const BSC_RPC = process.env.BSC_RPC;
const ETH_RPC = process.env.ETH_RPC;

//////////////// testnets ////////////////
const ARB_TEST_RPC = process.env.ARB_TEST_RPC;
const BSC_TEST_RPC = process.env.BSC_TEST_RPC;
const SEPOLIA_RPC = process.env.SEPOLIA_RPC;

const ARB_KEY = process.env.ARB_KEY;
const BASE_KEY = process.env.BASE_KEY;
const BSC_KEY = process.env.BSC_KEY;
const ETH_KEY = process.env.ETH_KEY;

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545/",
    },
    hardhat: {},
    ///////////// mainnets /////////////
    arb: {
      url: ARB_RPC,
      chainId: 42161,
      accounts: { mnemonic },
    },
    avax: {
      url: AVAX_RPC,
      accounts: { mnemonic },
    },
    base: {
      url: BASE_RPC,
      chainId: 8453,
      accounts: { mnemonic },
    },
    bsc: {
      url: BSC_RPC,
      accounts: { mnemonic },
    },
    eth: {
      url: ETH_RPC,
      chainId: 1,
      accounts: { mnemonic },
    },
    ///////////// tesnets /////////////
    bscTest: {
      url: BSC_TEST_RPC,
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
      url: ARB_TEST_RPC,
      chainId: 421613,
      gasPrice: 20000000000,
      accounts: { mnemonic },
    },
  },
  etherscan: {
    apiKey: {
      arb: ARB_KEY,
      avax: "placeholder",
      base: BASE_KEY,
      bsc: BSC_KEY,
      eth: ETH_KEY,
    },
    customChains: [
      {
        network: "base",
        chainId: 8453,
        urls: {
          apiURL: "https://api.basescan.org/api",
          browserURL: "https://api.basescan.org",
        },
      },
    ],
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
