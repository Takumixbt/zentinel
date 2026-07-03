# Zentinel

A confidential collateralization check built on [Zama's FHEVM](https://docs.zama.org/protocol). A wallet submits its
collateral and debt figures **encrypted**. The contract computes a safe/unsafe verdict on the encrypted numbers and
makes only that verdict publicly decryptable — the underlying collateral and debt amounts are never revealed to anyone
but the wallet itself.

This is the private equivalent of a DeFi lending protocol's health-factor check: today that check requires your entire
position to be public. Here, only the yes/no answer is.

## Live

- **App:** [zentinel-app.vercel.app](https://zentinel-app.vercel.app/)
- **Contract:** deployed on **Sepolia** at
  [`0xaEae5C4108CcFE09b4F9846638cF053887C88B13`](https://sepolia.etherscan.io/address/0xaEae5C4108CcFE09b4F9846638cF053887C88B13)

## How it works

1. **Encrypt & submit** — `submitPosition(collateral, debt)`: both values are encrypted client-side in the browser (via
   Zama's relayer SDK) before being sent on-chain as ciphertext plus a zero-knowledge input proof. The plaintext never
   touches the network.
2. **Compute a verdict** — `computeVerdict()`: the contract checks `collateral * 100 >= debt * requiredRatioPercent`
   entirely on ciphertext (no division needed), producing an encrypted safe/unsafe flag.
3. **Reveal only the verdict** — the flag is marked publicly decryptable via `FHE.makePubliclyDecryptable`, so any third
   party (e.g. a lending protocol) can read "safe" or "unsafe" without ever learning the collateral or debt amounts.
   Those stay decryptable only by the wallet that submitted them.

## Frontend

A Vite + React app in [`frontend/`](frontend) drives the real Sepolia contract end-to-end: connect a wallet, encrypt and
submit a position, compute the verdict, and reveal it — one encrypted step at a time. Built with React, wagmi +
RainbowKit for wallet connection, and Zama's `@zama-fhe/relayer-sdk` for client-side encryption/decryption.

```bash
cd frontend
npm install
npm run dev
```

No environment variables are required to run it. Optionally, set `VITE_WC_PROJECT_ID` (see `.env.example`) to enable
WalletConnect's mobile/QR wallet list — injected wallets like MetaMask work without it.

## Quick Start (contracts)

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
│   └── Zentinel.sol      # submit position, compute verdict, public/user decrypt paths
├── deploy/deploy.ts       # deploys with a 150% required collateralization ratio
├── test/Zentinel.ts       # mock-FHEVM test suite
└── frontend/              # Vite + React app driving the live Sepolia contract
```

## Status

Contract + mock-FHEVM test suite passing (6/6). Deployed live on Sepolia. Frontend built and deployed.

## Built with

[FHEVM](https://github.com/zama-ai/fhevm) by Zama, scaffolded from
[fhevm-hardhat-template](https://github.com/zama-ai/fhevm-hardhat-template). Frontend built with React, Vite, Tailwind
CSS, wagmi, RainbowKit, and Zama's relayer SDK.
