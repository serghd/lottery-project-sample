import { BigNumberish } from "ethers";
import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

import { getEnv } from "../../common/config";
import { callWithTimerHre, verifyContract } from "../../common/deploy";
import { LOTTERY_CONTRACT_NAME } from "../../constants";
import { defaultNetwork } from "../../hardhat.config";
import { getAddressesFromHre } from "../../utils/context";

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment): Promise<void> => {
   await callWithTimerHre(async () => {
      const proxyAddress = getAddressesFromHre(hre).lotteryContractAddress;
      const subscriptionId: BigNumberish = getEnv(
         `${defaultNetwork.toUpperCase()}_CHAINLINK_SUBSCRIPTION_ID`,
      );

      console.log(`${LOTTERY_CONTRACT_NAME} ${proxyAddress} is verifying...`);
      await verifyContract(proxyAddress, hre, [subscriptionId]);
   }, hre);
};

func.tags = ["lottery-contract-verify"];

export default func;
