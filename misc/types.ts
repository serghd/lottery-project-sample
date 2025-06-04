import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

export interface DeployNetworks {
   sepolia: string;
   hardhat: string;
}

export interface Addresses {
   lotteryContractAddress: string;
   usdTokenContractAddress: string;
   superOwnerAddress: string;
   ownerAddress: string;
}

export interface Users {
   superOwner: SignerWithAddress;
   owner: SignerWithAddress;
   user1: SignerWithAddress;
   user2: SignerWithAddress;
}

export type StringNumber = string | number;

export type DeployNetworkKey = keyof DeployNetworks;
