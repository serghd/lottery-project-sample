import { DeployFunction } from "hardhat-deploy/types";
import { defaultNetwork } from "~hardhat.config";

import { getEnv } from "../../common/config";
import { callWithTimerHre, verifyContract } from "../../common/deploy";
import { sleep } from "../../common/misc";
import { USD_TEST_CONTRACT_NAME } from "../../constants";
import { getAddressesFromHre, getOrDeployUsdTestContract, getUsers } from "../../utils/context";

const func: DeployFunction = async (hre): Promise<void> => {
   await callWithTimerHre(async () => {
      const { superOwnerAddress } = getAddressesFromHre(hre);
      const tokenDecimals: number = Number(
         getEnv(`${defaultNetwork.toUpperCase()}_USD_TOKEN_DECIMALS`),
      );

      console.log("TestUSD is deploying...");
      const { ownerUsdTestContract } = await getOrDeployUsdTestContract(await getUsers(), {
         owner: superOwnerAddress,
         tokenDecimals: tokenDecimals,
      });
      await ownerUsdTestContract.waitForDeployment();
      const addr: string = await ownerUsdTestContract.getAddress();
      console.log(`${USD_TEST_CONTRACT_NAME} deployed to ${addr}`);

      console.log("verifying...");
      await sleep(10000);
      const decimals = Number(getEnv(`${defaultNetwork.toUpperCase()}_USD_TOKEN_DECIMALS`));
      await verifyContract(addr, hre, [superOwnerAddress, decimals]);
      console.log(`TestUSD-contract ${addr} verified`);
   }, hre);
};

func.tags = ["test-usd-contract-deploy"];

export default func;
