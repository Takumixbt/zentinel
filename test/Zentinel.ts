import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { ethers, fhevm } from "hardhat";
import { Zentinel, Zentinel__factory } from "../types";
import { expect } from "chai";
import { FhevmType } from "@fhevm/hardhat-plugin";

const REQUIRED_RATIO_PERCENT = 150;

type Signers = {
  deployer: HardhatEthersSigner;
  alice: HardhatEthersSigner;
  bob: HardhatEthersSigner;
};

async function deployFixture() {
  const factory = (await ethers.getContractFactory("Zentinel")) as Zentinel__factory;
  const riskGateContract = (await factory.deploy(REQUIRED_RATIO_PERCENT)) as Zentinel;
  const riskGateContractAddress = await riskGateContract.getAddress();

  return { riskGateContract, riskGateContractAddress };
}

describe("Zentinel", function () {
  let signers: Signers;
  let riskGateContract: Zentinel;
  let riskGateContractAddress: string;

  before(async function () {
    const ethSigners: HardhatEthersSigner[] = await ethers.getSigners();
    signers = { deployer: ethSigners[0], alice: ethSigners[1], bob: ethSigners[2] };
  });

  beforeEach(async function () {
    if (!fhevm.isMock) {
      console.warn(`This hardhat test suite cannot run on Sepolia Testnet`);
      this.skip();
    }

    ({ riskGateContract, riskGateContractAddress } = await deployFixture());
  });

  async function submitPosition(signer: HardhatEthersSigner, collateral: number, debt: number) {
    const encryptedInput = await fhevm
      .createEncryptedInput(riskGateContractAddress, signer.address)
      .add64(collateral)
      .add64(debt)
      .encrypt();

    const tx = await riskGateContract
      .connect(signer)
      .submitPosition(encryptedInput.handles[0], encryptedInput.handles[1], encryptedInput.inputProof);
    await tx.wait();
  }

  it("stores the required ratio set at deployment", async function () {
    expect(await riskGateContract.requiredRatioPercent()).to.eq(REQUIRED_RATIO_PERCENT);
  });

  it("reports no position before one is submitted", async function () {
    expect(await riskGateContract.hasPosition(signers.alice.address)).to.eq(false);
  });

  it("marks a well-collateralized position as safe", async function () {
    // 200 collateral vs 100 debt = 200% ratio, above the 150% requirement
    await submitPosition(signers.alice, 200, 100);
    expect(await riskGateContract.hasPosition(signers.alice.address)).to.eq(true);

    const tx = await riskGateContract.connect(signers.alice).computeVerdict();
    await tx.wait();

    const verdictHandle = await riskGateContract.getVerdict(signers.alice.address);
    const isSafe = await fhevm.publicDecryptEbool(verdictHandle);

    expect(isSafe).to.eq(true);
  });

  it("marks an under-collateralized position as unsafe", async function () {
    // 120 collateral vs 100 debt = 120% ratio, below the 150% requirement
    await submitPosition(signers.bob, 120, 100);

    const tx = await riskGateContract.connect(signers.bob).computeVerdict();
    await tx.wait();

    const verdictHandle = await riskGateContract.getVerdict(signers.bob.address);
    const isSafe = await fhevm.publicDecryptEbool(verdictHandle);

    expect(isSafe).to.eq(false);
  });

  it("only lets the position owner decrypt their own collateral and debt", async function () {
    await submitPosition(signers.alice, 200, 100);

    const [collateralHandle, debtHandle] = await riskGateContract.connect(signers.alice).getMyPosition();

    const clearCollateral = await fhevm.userDecryptEuint(
      FhevmType.euint64,
      collateralHandle,
      riskGateContractAddress,
      signers.alice,
    );
    const clearDebt = await fhevm.userDecryptEuint(
      FhevmType.euint64,
      debtHandle,
      riskGateContractAddress,
      signers.alice,
    );

    expect(clearCollateral).to.eq(200);
    expect(clearDebt).to.eq(100);
  });

  it("rejects computing a verdict before a position is submitted", async function () {
    await expect(riskGateContract.connect(signers.alice).computeVerdict()).to.be.revertedWith(
      "no position submitted",
    );
  });
});
