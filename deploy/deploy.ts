import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const REQUIRED_RATIO_PERCENT = 150; // 150% collateralization required to be "safe"

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  const deployedZentinel = await deploy("Zentinel", {
    from: deployer,
    args: [REQUIRED_RATIO_PERCENT],
    log: true,
  });

  console.log(`Zentinel contract: `, deployedZentinel.address);
};
export default func;
func.id = "deploy_zentinel";
func.tags = ["Zentinel"];
