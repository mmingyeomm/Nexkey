import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      },
      viaIR: true
    }
  },
  networks: {
    // Local Besu development network (Docker)
    besu: {
      url: "http://localhost:8545",
      accounts: [
        "0x8f2a55949038a9610f50fb23b5883af3b4ecb3c3bb792cbcefbd1542c692be63", // 기존 Besu 개발용 계정 (마이너)
        "0x937ca84c6ba5df9106fb9ea6ea324bfb9daa719bba9dfe3a9363305d4aa857c0", // 새로 생성된 계정 1
        "0xc279bc61409d254adb64ea5c1e168a1772557f282730d685ba31b6700eac5246", // 새로 생성된 계정 2
        "0xd7e3c26e97f973bbd6caf15a1830ce4f7a324d1eafbf708744efe8a0366d4828", // 새로 생성된 계정 3
        "0x5a5a71115681e0d7d2bb9e9e63f5a6dfb5dd266ae86ea4b4079630e918b67d1a", // 새로 생성된 계정 4
        "0x895379478075bb3c2dc24d981993c5b5973d7595d71a9813585d207c708e4a88", // 새로 생성된 계정 5
        "0x6bda660f1559fcaa583338c89f57e560985f7bcbb2dc1cb0638ec63938884b36", // 새로 생성된 계정 6
        "0xf419c414ac28e6f7a2cb55009503a1f01065d60fe171f686ecbc39358eec3edd", // 새로 생성된 계정 7
        "0xa4165d53ef295fd250739db5eea000698c7451e587745a54233bd8e045fe6a75", // 새로 생성된 계정 8
        "0xc257de69a0284dc0601ca255910e948d15d62eed1799257e4a39cd6dcb51aebe" // 새로 생성된 계정 9
      ],
      chainId: 1337, // Development chain ID
      gas: 9007199254740991,
      allowUnlimitedContractSize: true,
      timeout: 60000
    },
    // Render-hosted Besu network
    render: {
      url: "https://besu-latest.onrender.com",
      accounts: [
        "0x8f2a55949038a9610f50fb23b5883af3b4ecb3c3bb792cbcefbd1542c692be63", // 기존 Besu 개발용 계정 (마이너)
        "0x937ca84c6ba5df9106fb9ea6ea324bfb9daa719bba9dfe3a9363305d4aa857c0", // 새로 생성된 계정 1
        "0xc279bc61409d254adb64ea5c1e168a1772557f282730d685ba31b6700eac5246", // 새로 생성된 계정 2
        "0xd7e3c26e97f973bbd6caf15a1830ce4f7a324d1eafbf708744efe8a0366d4828", // 새로 생성된 계정 3
        "0x5a5a71115681e0d7d2bb9e9e63f5a6dfb5dd266ae86ea4b4079630e918b67d1a", // 새로 생성된 계정 4
        "0x895379478075bb3c2dc24d981993c5b5973d7595d71a9813585d207c708e4a88", // 새로 생성된 계정 5
        "0x6bda660f1559fcaa583338c89f57e560985f7bcbb2dc1cb0638ec63938884b36", // 새로 생성된 계정 6
        "0xf419c414ac28e6f7a2cb55009503a1f01065d60fe171f686ecbc39358eec3edd", // 새로 생성된 계정 7
        "0xa4165d53ef295fd250739db5eea000698c7451e587745a54233bd8e045fe6a75", // 새로 생성된 계정 8
        "0xc257de69a0284dc0601ca255910e948d15d62eed1799257e4a39cd6dcb51aebe" // 새로 생성된 계정 9
      ],
      chainId: 1337, // Same as local - confirmed from Chain ID response
      gas: 9007199254740991,
      timeout: 60000,
    },
  },
  defaultNetwork: "hardhat"
};

export default config;
