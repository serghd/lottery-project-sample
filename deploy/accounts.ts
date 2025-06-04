import { Signer, toBigInt } from "ethers";
import { ethers } from "hardhat";
import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

import { getNetworkName } from "../common/deploy";
import { HardhatEthersSigner } from "../node_modules/@nomicfoundation/hardhat-ethers/signers";

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment): Promise<void> => {
   const name = getNetworkName(hre);

   console.log(`List of accounts in ${name}:`);
   const accounts: HardhatEthersSigner[] = await hre.ethers.getSigners();

   let total: bigint = BigInt(0);

   const result = await Promise.all(
      accounts.map(async (account) => {
         const address = await account.getAddress();
         const balance = toBigInt(await ethers.provider.getBalance(address));
         total += balance;
         return {
            address,
            balance,
         };
      }),
   );

   console.table(result);
   console.log(`total: ${total}`);
};

func.tags = ["accounts"];

export default func;
