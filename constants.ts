import { getEnv } from "./common/config";
import { DeployNetworks } from "./misc/types";

export const LOTTERY_CONTRACT_NAME = "LotteryContract";

export enum CONTRACT_LIST {
   LOTTERY = "LOTTERY",
   USD = "USD",
}

export const USD_TEST_CONTRACT_NAME = "TestUSD";

export enum ACCOUNT_LIST {
   SUPER_OWNER = "SUPER_OWNER",
   OWNER = "OWNER",
   USER1 = "USER1",
}

export const CONTRACTS: Record<CONTRACT_LIST, DeployNetworks> = {
   LOTTERY: {
      sepolia: getEnv("SEPOLIA_LOTTERY_CONTRACT_ADDRESS"),
      hardhat: "",
   },
   USD: {
      sepolia: getEnv("SEPOLIA_USD_TOKEN_ADDRESS"),
      hardhat: "",
   },
};

export const ACCOUNTS: Record<ACCOUNT_LIST, DeployNetworks> = {
   SUPER_OWNER: {
      sepolia: "0x13C54cA7a6987ccB71e16373FFe2236799c7BcAc",
      hardhat: "0x13C54cA7a6987ccB71e16373FFe2236799c7BcAc",
   },
   OWNER: {
      sepolia: "0xAa6f1fAE9eeA0741E7FF6A305F4CEd2A91774863",
      hardhat: "0xAa6f1fAE9eeA0741E7FF6A305F4CEd2A91774863",
   },
   USER1: {
      sepolia: "0x706564866BfFbef6353cF56a5824c43dB91DfeDF",
      hardhat: "0x706564866BfFbef6353cF56a5824c43dB91DfeDF",
   },
};
