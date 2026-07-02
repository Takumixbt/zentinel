import { sepolia } from "wagmi/chains";

/** Live, verified Zentinel deployment on Sepolia. */
export const ZENTINEL_ADDRESS = "0xaEae5C4108CcFE09b4F9846638cF053887C88B13" as const;

export const CHAIN = sepolia;
export const CHAIN_ID = sepolia.id; // 11155111

export const ETHERSCAN_ADDRESS_URL = `https://sepolia.etherscan.io/address/${ZENTINEL_ADDRESS}`;
export const GITHUB_URL = "https://github.com/Takumixbt/zentinel";

/** Minimal ABI covering the public surface the frontend touches. */
export const ZENTINEL_ABI = [
  {
    type: "function",
    name: "requiredRatioPercent",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint32" }],
  },
  {
    type: "function",
    name: "hasPosition",
    stateMutability: "view",
    inputs: [{ name: "", type: "address" }],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    type: "function",
    name: "submitPosition",
    stateMutability: "nonpayable",
    inputs: [
      { name: "collateralInput", type: "bytes32" },
      { name: "debtInput", type: "bytes32" },
      { name: "inputProof", type: "bytes" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "computeVerdict",
    stateMutability: "nonpayable",
    inputs: [],
    outputs: [],
  },
  {
    type: "function",
    name: "getVerdict",
    stateMutability: "view",
    inputs: [{ name: "wallet", type: "address" }],
    outputs: [{ name: "", type: "bytes32" }],
  },
  {
    type: "function",
    name: "getMyPosition",
    stateMutability: "view",
    inputs: [],
    outputs: [
      { name: "collateral", type: "bytes32" },
      { name: "debt", type: "bytes32" },
    ],
  },
  {
    type: "event",
    name: "PositionSubmitted",
    inputs: [{ name: "wallet", type: "address", indexed: true }],
  },
  {
    type: "event",
    name: "VerdictComputed",
    inputs: [{ name: "wallet", type: "address", indexed: true }],
  },
] as const;

/** All-zero handle: contract returns this before a value/verdict exists. */
export const ZERO_HANDLE = "0x0000000000000000000000000000000000000000000000000000000000000000";

export function isZeroHandle(handle?: string | null): boolean {
  return !handle || handle.toLowerCase() === ZERO_HANDLE;
}
