import "@nomicfoundation/hardhat-ethers";
import "@nomicfoundation/hardhat-toolbox";
import "@openzeppelin/hardhat-upgrades";
import { config as dotenvConfig } from "dotenv";
import "hardhat-deploy";
import { HardhatUserConfig } from "hardhat/config";
import { NetworkUserConfig } from "hardhat/types";
import { resolve } from "path";
import "tsconfig-paths/register";

import { getEnv } from "./common/config";
import { DeployNetworks } from "./misc/types";

const dotenvConfigPath: string = process.env.DOTENV_CONFIG_PATH || "./.env";
dotenvConfig({
   path: resolve(__dirname, dotenvConfigPath),
});

function getChainConfig(chain: keyof DeployNetworks): NetworkUserConfig & { url?: string } {
   return {
      url: getEnv(`${chain.toUpperCase()}_PROVIDER_HTTP_URL`),
      // can be useful for mainnet:
      // gasPrice: 1_100_000,
      accounts: [
         `0x${getEnv("SUPER_OWNER_PRIVATE_KEY")}`,
         `0x${getEnv("OWNER_PRIVATE_KEY")}`,
         `0x${getEnv("USER1_PRIVATE_KEY")}`,
      ],
   };
}

export const defaultNetwork: keyof DeployNetworks = "sepolia";

const config: HardhatUserConfig = {
   defaultNetwork: defaultNetwork,
   networks: {
      sepolia: getChainConfig("sepolia"),
      hardhat: {
         forking: {
            enabled: false,
            url: getChainConfig(defaultNetwork).url ?? "",
            blockNumber: 39656567,
         },
         initialBaseFeePerGas: 0,
         mining: {
            auto: true,
         },
         gasPrice: 0,
      },
   },
   etherscan: {
      apiKey: getEnv("SEPOLIA_SCAN_API_KEY"),
   },
   gasReporter: {
      currency: "USD",
      enabled: false,
      excludeContracts: [],
   },
   paths: {
      artifacts: "./artifacts",
      cache: "./cache",
      sources: "./contracts",
      tests: "./test",
   },
   solidity: {
      compilers: [
         {
            version: "0.8.23",
            settings: {
               metadata: {
                  bytecodeHash: "none",
               },
               optimizer: {
                  enabled: true,
                  runs: 800,
               },
            },
         },
      ],
   },
   namedAccounts: {
      deployer: {
         default: 0, // here this will by default take the first account as deployer
      },
   },
   typechain: {
      // outDir: "types",
      target: "ethers-v6",
   },
};

export default config;
