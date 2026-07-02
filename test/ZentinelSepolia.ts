import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { ethers, fhevm, deployments } from "hardhat";
import { Zentinel } from "../types";
import { expect } from "chai";

describe("ZentinelSepolia", function () {
  let signers: { deployer: HardhatEthersSigner };
  let riskGateContract: Zentinel;
  let riskGateContractAddress: string;
  let step: number;
  let steps: number;

  function progress(message: string) {
    console.log(`${++step}/${steps} ${message}`);
  }

  before(async function () {
    if (fhevm.isMock) {
      console.warn(`This hardhat test suite can only run on Sepolia Testnet`);
      this.skip();
    }

    try {
      const ZentinelDeployment = await deployments.get("Zentinel");
      riskGateContractAddress = ZentinelDeployment.address;
      riskGateContract = await ethers.getContractAt("Zentinel", ZentinelDeployment.address);
    } catch (e) {
      (e as Error).message += ". Call 'npx hardhat deploy --network sepolia'";
      throw e;
    }

    const ethSigners: HardhatEthersSigner[] = await ethers.getSigners();
    signers = { deployer: ethSigners[0] };
  });

  beforeEach(async () => {
    step = 0;
    steps = 0;
  });

  it("submits a position and computes a public verdict on-chain", async function () {
    steps = 8;
    this.timeout(4 * 40000);

    progress(`Required ratio on deployed contract: ${await riskGateContract.requiredRatioPercent()}%`);

    progress(`Encrypting collateral=200, debt=100...`);
    const encryptedInput = await fhevm
      .createEncryptedInput(riskGateContractAddress, signers.deployer.address)
      .add64(200)
      .add64(100)
      .encrypt();

    progress(`Calling submitPosition on Zentinel=${riskGateContractAddress}...`);
    let tx = await riskGateContract
      .connect(signers.deployer)
      .submitPosition(encryptedInput.handles[0], encryptedInput.handles[1], encryptedInput.inputProof);
    await tx.wait();

    progress(`Calling computeVerdict()...`);
    tx = await riskGateContract.connect(signers.deployer).computeVerdict();
    await tx.wait();

    progress(`Reading verdict handle...`);
    const verdictHandle = await riskGateContract.getVerdict(signers.deployer.address);

    progress(`Publicly decrypting verdict handle=${verdictHandle}...`);
    const isSafe = await fhevm.publicDecryptEbool(verdictHandle);
    progress(`Clear verdict: ${isSafe ? "SAFE" : "UNSAFE"}`);

    expect(isSafe).to.eq(true);
  });
});
