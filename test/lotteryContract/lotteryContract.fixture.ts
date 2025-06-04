import { defaultNetwork } from "../../hardhat.config";
import { getEnv } from "../../common/config";
import {
   getOrDeployLotteryContract,
   getOrDeployUsdTestContract,
   getUsers,
} from "../../utils/context";
import { ContextBase } from "./types";
import { BigNumberish } from "../../node_modules/ethers/lib.commonjs";

export async function deployLotteryContractFixture(): Promise<ContextBase> {
   const users = await getUsers();
   const { superOwner, owner, user1, user2 } = users;
   const usdTokenSymbol: string = String(
      getEnv(`${defaultNetwork.toUpperCase()}_USD_TOKEN_SYMBOL`),
   );
   const usdTokenDecimals: number = Number(
      getEnv(`${defaultNetwork.toUpperCase()}_USD_TOKEN_DECIMALS`),
   );
   const chainLinkSubscriptionId: BigNumberish = getEnv(
      `${defaultNetwork.toUpperCase()}_CHAINLINK_SUBSCRIPTION_ID`,
   );

   const { superOwnerUsdTestContract, ownerUsdTestContract, user1UsdTestContract } =
      await getOrDeployUsdTestContract(users, { owner: superOwner.address, tokenDecimals: 18 });

   const {
      superOwnerLotteryContract,
      ownerLotteryContract,
      user1LotteryContract
   } = await getOrDeployLotteryContract(users, {
      superOwner: superOwner.address,
      usdTokenAddress: await superOwnerUsdTestContract.getAddress(),
      usdTokenSymbol: usdTokenSymbol,
      usdTokenDecimals: usdTokenDecimals,
      chainLinkSubscriptionId: chainLinkSubscriptionId
   });

   await superOwnerLotteryContract.waitForDeployment();

   return {
      superOwner,
      owner,
      user1,
      user2,
      superOwnerLotteryContract,
      superOwnerUsdTestContract,
      ownerLotteryContract,
      user1LotteryContract,
      ownerUsdTestContract,
      user1UsdTestContract,
   };
}
