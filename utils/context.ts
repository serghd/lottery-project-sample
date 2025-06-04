import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { BigNumberish } from "ethers";
import { ethers } from "hardhat";
import { HardhatRuntimeEnvironment } from "hardhat/types";

import { getNetworkName } from "../common/deploy";
import { ACCOUNTS, CONTRACTS, LOTTERY_CONTRACT_NAME, USD_TEST_CONTRACT_NAME } from "../constants";
import { Addresses, DeployNetworks, Users } from "../misc/types";
import { LotteryContract } from "../typechain-types/contracts/lottery/LotteryContract";
import { TestUSD } from "../typechain-types/contracts/testUSD/TestUSD";
import { LotteryContract__factory } from "../typechain-types/factories/contracts/lottery/LotteryContract__factory";
import { TestUSD__factory } from "../typechain-types/factories/contracts/testUSD/TestUSD__factory";

export function getAddresses(network: keyof DeployNetworks): Addresses {
   const superOwnerAddress = ACCOUNTS.SUPER_OWNER[network];
   const ownerAddress = ACCOUNTS.OWNER[network];
   const lotteryContractAddress = CONTRACTS.LOTTERY[network];
   const usdTokenContractAddress = CONTRACTS.USD[network];
   return {
      superOwnerAddress,
      ownerAddress,
      lotteryContractAddress,
      usdTokenContractAddress,
   };
}

export function getAddressesFromHre(hre: HardhatRuntimeEnvironment) {
   return getAddresses(getNetworkName(hre));
}

export async function getUsers(): Promise<Users> {
   const [superOwner, owner, user1, user2] = await ethers.getSigners();
   return {
      superOwner,
      owner,
      user1,
      user2,
   };
}

export async function getUserByAddress(address: string): Promise<SignerWithAddress> {
   return await ethers.getSigner(address);
}

export async function getOrDeployLotteryContract(
   users: Users,
   constructParams:
      | {
           superOwner: string;
           usdTokenAddress: string;
           usdTokenSymbol: string;
           usdTokenDecimals: number;
           chainLinkSubscriptionId: BigNumberish;
        }
      | string,
) {
   const { superOwner, owner, user1 } = users;

   const lotteryContractFactory = (await ethers.getContractFactory(
      LOTTERY_CONTRACT_NAME,
   )) as unknown as LotteryContract__factory;

   let contract: LotteryContract;

   if (typeof constructParams === "string") {
      const lotteryContractAddress = constructParams as string;
      contract = lotteryContractFactory
         .connect(superOwner)
         .attach(lotteryContractAddress) as LotteryContract;
   } else {
      contract = (await lotteryContractFactory
         .connect(superOwner)
         .deploy(
            constructParams.superOwner,
            constructParams.usdTokenAddress,
            constructParams.usdTokenSymbol,
            constructParams.usdTokenDecimals,
            constructParams.chainLinkSubscriptionId,
         )) as LotteryContract;
   }

   const superOwnerLotteryContract = contract.connect(superOwner) as LotteryContract;
   const ownerLotteryContract = contract.connect(owner) as LotteryContract;
   const user1LotteryContract = contract.connect(user1) as LotteryContract;

   return {
      lotteryContractFactory,
      superOwnerLotteryContract,
      ownerLotteryContract,
      user1LotteryContract,
   };
}

export async function getOrDeployUsdTestContract(
   users: Users,
   createObj:
      | {
           owner: string;
           tokenDecimals: number;
        }
      | string,
) {
   const { superOwner, owner, user1 } = users;

   const usdTestFactory = (await ethers.getContractFactory(
      USD_TEST_CONTRACT_NAME,
   )) as unknown as TestUSD__factory;

   let testUSDContract: TestUSD;

   if (typeof createObj === "string") {
      const tokenAddress = createObj as string;
      testUSDContract = usdTestFactory.connect(superOwner).attach(tokenAddress) as TestUSD;
   } else {
      /**
       * with gas price:
       * .deploy(createObj.tokenDecimals, {nonce: 21, gasPrice: 400_000_000_000})) as TestUSD;
       */
      testUSDContract = (await usdTestFactory
         .connect(superOwner)
         .deploy(createObj.owner, createObj.tokenDecimals)) as TestUSD;
   }

   const superOwnerUsdTestContract = testUSDContract.connect(superOwner) as TestUSD;
   const ownerUsdTestContract = testUSDContract.connect(owner) as TestUSD;
   const user1UsdTestContract = testUSDContract.connect(user1) as TestUSD;

   return {
      superOwnerUsdTestContract,
      ownerUsdTestContract,
      user1UsdTestContract,
   };
}
