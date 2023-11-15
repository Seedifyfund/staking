# Staking

Both `main` and `zok-prelim-report` have been deployed on BSC mainnet:

- Old contracts are using `zok-prelim-report` from hash `89559ba688d6ec6c19da04e3b600a84ffa2663a9` (solidity 0.8.9)
- New contracts are using `main` from hash `161df000273e608f84f5e8e0d1ecb24b4a01f997` (solidity 0.5.16) - this should be the audited hash according to @awaitFix

## Configuration

Doc from agency, says:

<img width="668" alt="staking-APY-lock_duration" src="https://github.com/Seedifyfund/Locked-Staking/assets/37904797/fa608eef-b21b-4674-a350-0d728c1ffc09">

## Mainnet

**Roundup** staking APRs and rate will be used for Ethereum and Arbitrum mainnets:

![days-APR-rate](https://github.com/Seedifyfund/Locked-Staking/assets/37904797/dca05685-a747-4ee7-8cf0-0b0b95c81839)

### Addresses

SFUND on both Ethereum & Arbitrum at: `0x560363BdA52BC6A44CA6C8c9B4a5FadbDa32fa60`

#### Ethereum Network

- ETH_30Days : https://etherscan.io/address/0x1d22275d58a836f8307c306110deafe22e360877
- ETH_90Days : https://etherscan.io/address/0xbcc572d3f2f619b082794a96a848a23c2a752fcf
- ETH_180Days : https://etherscan.io/address/0x453bbf5ad5011a89390a1e96042a19d5f4892754
- ETH_270Days : https://etherscan.io/address/0x569399bfca76e7664cec6510adc75f2811be2c5c

#### Arbitrum Network

- ARB_30Days : https://arbiscan.io/address/0x1d22275d58a836f8307c306110deafe22e360877
- ARB_90Days : https://arbiscan.io/address/0xaae4355b30e18879a12e4e22283da901af47d6cd
- ARB_180Days : https://arbiscan.io/address/0x9f07a4cf035f14c0160db2d7d94eb5a41f114805
- ARB_270 Days : https://arbiscan.io/address/0xc30be140f8ada0fdb0c97377c98ddbe8b343679a

## Testnet

### Specific Configuration

- `100% targeted APY` for all contracts
- Calculating hours, expressed in days (contract is not supporting less than days and solidity does not support decimals):
  - 1h = (1 day /24 hours) = 0.04166666667
  - 6h = (1 day /24 hours) \* 6 = 0.25
  - etc...

Use hours instead of days for testing purposes:

- 30 days becomes 1h:
  - `rate` = 1 = (100 _ ( (1/24) _ 1) / 365) \* 100 (should have been `1.1415525114` if decimals were managed correctly in the contract)
  - `lockDuration` = 1
- 90 days becomes 3h:
  - `rate` = 3 (should have been `3.4246575342` if decimals were managed correctly in the contract)
  - `lockDuration` = 3
- 180 days becomes 6h:
  - `rate` = 7 (should have been `6.8493150685` if decimals were managed correctly in the contract)
  - `lockDuration` = 6
- 270 days becomes 9h:
  - `rate` = 10 (should have been `10.2739726027` if decimals were managed correctly in the contract)
  - `lockDuration` = 9

### Addresses

- BSC:
  - 30days: https://testnet.bscscan.com/address/0xb4b5dc840f1ae81920c36a5dfb7bd8eb15d089c3#code
- Sepolia:
  - 30days: https://sepolia.etherscan.io/address/0x7fb334AA579E7F6B302661EF79aF385ad44e9733#code
  - 90 days: https://sepolia.etherscan.io/address/0xCB67DC1aABDb8AE9a22575047aEf0317f204D55a#code
  - 180 days: https://sepolia.etherscan.io/address/0x3EC1f2d2DCedB98Ac53334C837D9f8ac93c6B469#code
  - 270 days: https://sepolia.etherscan.io/address/0x80679EAFDf452ac6fAe6876227Bd228892175874#code
- ARB Goerli:
  - 30days: https://goerli.arbiscan.io/address/0x5a73bc35f5b1020b9f990442dcd7384A82C84997#code
  - 90 days: https://goerli.arbiscan.io/address/0x394847038eE56af38f3c73b227961a52f0b92b87#code
  - 180 days: https://goerli.arbiscan.io/address/0x53861a3EBD584Dc4A626F6284613546e1cA569aB#code
  - 270 days: https://goerli.arbiscan.io/address/0x2C26007c52f543C89e8b3C9f16c8c762E2368668#code

### Token

- BSC: https://testnet.bscscan.com/address/0x0a0fDa2921EC382b7D43e8A2Bb3524a941C767bb
- Sepolia: https://sepolia.etherscan.io/address/0x394847038eE56af38f3c73b227961a52f0b92b87#code
- ARB Goerli: https://goerli.arbiscan.io/address/0x2B7CCBA0225bA5104973821e52C971C0d5882BaA#code

- Arb mainnet (testing purposes):
  - MCKT token: https://arbiscan.io/address/0x2B7CCBA0225bA5104973821e52C971C0d5882BaA
