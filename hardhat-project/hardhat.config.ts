import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  networks: {
    besu: {
      url: "http://localhost:8545",
      chainId: 1337, // Development chain ID
      accounts: [
        // Besu dev network default account private key
        "0x8f2a55949038a9610f50fb23b5883af3b4ecb3c3bb792cbcefbd1542c692be63"
      ],
      allowUnlimitedContractSize: true,
      timeout: 60000
    }
  },
  defaultNetwork: "besu"
};

export default config;
