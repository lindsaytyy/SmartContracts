require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy");

module.exports = {
  solidity: "0.8.28",
  networks: {
    hardhat: {
      ws: true,
      mining: {
        auto: false,
        interval: 1000 // 每秒生成一个新区块
      }
    },
    localhost: {
      url: "http://127.0.0.1:8545"
    }
  },
  namedAccounts: {
    deployer: {
      default: 0
    }

  }
}
