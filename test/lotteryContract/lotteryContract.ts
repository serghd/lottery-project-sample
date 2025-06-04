import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

import { LOTTERY_CONTRACT_NAME } from "../../constants";
import { shouldBehaveCorrectFunding } from "./lotteryContract.behavior.funding";
import { deployLotteryContractFixture } from "./lotteryContract.fixture";

describe(LOTTERY_CONTRACT_NAME, function () {
   before(async function () {
      this.loadFixture = loadFixture;
   });

   beforeEach(async function () {
      const {
         superOwnerLotteryContract,
         superOwnerUsdTestContract,
         ownerLotteryContract,
         user1LotteryContract,
         user2LotteryContract,
         ownerUsdTestContract,
         user1UsdTestContract,
         superOwner,
         owner,
         user1,
         user2,
      } = await this.loadFixture(deployLotteryContractFixture);

      this.superOwnerLotteryContract = superOwnerLotteryContract;
      this.ownerLotteryContract = ownerLotteryContract;
      this.user1LotteryContract = user1LotteryContract;
      this.user2LotteryContract = user2LotteryContract;
      this.superOwnerUsdTestContract = superOwnerUsdTestContract;
      this.ownerUsdTestContract = ownerUsdTestContract;
      this.user1UsdTestContract = user1UsdTestContract;
      this.superOwner = superOwner;
      this.owner = owner;
      this.user1 = user1;
      this.user2 = user2;
   });

   shouldBehaveCorrectFunding();
});
