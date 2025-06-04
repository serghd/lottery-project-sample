import { BigNumberish } from "ethers";
import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

import { getEnv } from "../../common/config";
import { callWithTimerHre, verifyContract } from "../../common/deploy";
import { sleep } from "../../common/misc";
import { LOTTERY_CONTRACT_NAME } from "../../constants";
import { defaultNetwork } from "../../hardhat.config";
import { getAddressesFromHre, getOrDeployLotteryContract, getUsers } from "../../utils/context";

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment): Promise<void> => {
   await callWithTimerHre(async () => {
      const { superOwnerAddress } = getAddressesFromHre(hre);
      const usdTokenAddress: string = String(
         getEnv(`${defaultNetwork.toUpperCase()}_USD_TOKEN_ADDRESS`),
      );
      const usdTokenSymbol: string = String(
         getEnv(`${defaultNetwork.toUpperCase()}_USD_TOKEN_SYMBOL`),
      );
      const usdTokenDecimals: number = Number(
         getEnv(`${defaultNetwork.toUpperCase()}_USD_TOKEN_DECIMALS`),
      );
      const chainLinkSubscriptionId: BigNumberish = getEnv(
         `${defaultNetwork.toUpperCase()}_CHAINLINK_SUBSCRIPTION_ID`,
      );

      console.log(`Contract Owner Address: ${superOwnerAddress}`);
      console.log(`ChainLink Subscription-Id: ${chainLinkSubscriptionId}`);

      console.log(`${LOTTERY_CONTRACT_NAME} is deploying...`);
      const { superOwnerLotteryContract } = await getOrDeployLotteryContract(await getUsers(), {
         superOwner: superOwnerAddress,
         usdTokenAddress,
         usdTokenSymbol,
         usdTokenDecimals,
         chainLinkSubscriptionId,
      });
      await superOwnerLotteryContract.waitForDeployment();
      const randomizerChainLinkContractAddr: string = await superOwnerLotteryContract.getAddress();
      console.log(`${LOTTERY_CONTRACT_NAME} deployed to ${randomizerChainLinkContractAddr}`);

      console.log("verifying...");
      await sleep(15000);
      await verifyContract(randomizerChainLinkContractAddr, hre, [
         superOwnerAddress,
         usdTokenAddress,
         usdTokenSymbol,
         usdTokenDecimals,
         chainLinkSubscriptionId,
      ]);
      console.log(
         `${LOTTERY_CONTRACT_NAME} deployed and verified to ${randomizerChainLinkContractAddr}`,
      );
   }, hre);
};

func.tags = ["lottery-contract-deploy"];

export default func;
