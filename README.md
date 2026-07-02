# Zentinel

A confidential collateralization check built on [Zama's FHEVM](https://docs.zama.org/protocol). A wallet submits its
collateral and debt figures **encrypted**. The contract computes a safe/unsafe verdict on the encrypted numbers and
makes only that verdict publicly decryptable — the underlying collateral and debt amounts are never revealed to
anyone but the wallet itself.

This is the private equivalent of a DeFi lending protocol's health-factor check: today that check requires your
entire position to be public. Here, only the yes/no answer is.

## Live Deployment

Deployed on **Sepolia** at [`0xaEae5C4108CcFE09b4F9846638cF053887C88B13`](https://sepolia.etherscan.io/address/0xaEae5C4108CcFE09b4F9846638cF053887C88B13).

## How it works

1. **Submit a position** — `submitPosition(collateral, debt)`: both values are encrypted client-side before being
   sent on-chain.
2. **Compute a verdict** — `computeVerdict()`: the contract checks `collateral * 100 >= debt * requiredRatioPercent`
   entirely on ciphertext (no division needed), producing an encrypted safe/unsafe flag.
3. **Reveal only the verdict** — the flag is marked publicly decryptable via `FHE.makePubliclyDecryptable`, so any
   third party (e.g. a lending protocol) can read "safe" or "unsafe" without ever learning the collateral or debt
   amounts. Those stay decryptable only by the wallet that submitted them.

## Quick Start

```bash
npm install
npm run compile
npm run test
```

### Deploy locally

```bash
npx hardhat node
npx hardhat deploy --network localhost
```

### Deploy to Sepolia Testnet

```bash
npx hardhat vars set MNEMONIC
npx hardhat vars set INFURA_API_KEY
npx hardhat deploy --network sepolia
npx hardhat verify --network sepolia <CONTRACT_ADDRESS>
```

## Project Structure

```
zentinel/
├── contracts/
│   └── Zentinel.sol   # submit position, compute verdict, public/user decrypt paths
├── deploy/deploy.ts    # deploys with a 150% required collateralization ratio
├── test/Zentinel.ts    # mock-FHEVM test suite
```

## Status

Contract + mock-FHEVM test suite passing (6/6). Deployed live on Sepolia. No frontend yet.

## Built with

[FHEVM](https://github.com/zama-ai/fhevm) by Zama, scaffolded from
[fhevm-hardhat-template](https://github.com/zama-ai/fhevm-hardhat-template).
