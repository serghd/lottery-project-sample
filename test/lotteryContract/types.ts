import { Users } from "../../misc/types";
import { LotteryContract } from "../../typechain-types/contracts/lottery/LotteryContract";
import { TestUSD } from "../../typechain-types/contracts/testUSD/TestUSD";

export interface ContextBase extends Users {
   superOwnerLotteryContract: LotteryContract;
   superOwnerUsdTestContract: TestUSD;
   ownerLotteryContract: LotteryContract;
   user1LotteryContract: LotteryContract;
   ownerUsdTestContract: TestUSD;
   user1UsdTestContract: TestUSD;
}
