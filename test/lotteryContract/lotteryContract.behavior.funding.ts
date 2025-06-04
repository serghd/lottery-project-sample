import { expect } from "chai";
import { seedData } from "./testData";

export function shouldBehaveCorrectFunding(): void {
   describe("funding", () => {
      it("make a Bid", async function () {

         await this.superOwnerUsdTestContract.mint(
            await this.user1.getAddress(),
            seedData.price0,
         );
         const user1balance = await this.superOwnerUsdTestContract.balanceOf(this.user1.address);
         expect(user1balance).equal(seedData.price0);

         await this.user1UsdTestContract.approve(
            await this.superOwnerLotteryContract.getAddress(),
            seedData.price0,
         );
      });
   });
}
