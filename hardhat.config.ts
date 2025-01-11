require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy");
require("@chainlink/env-enc").config()
require("@nomicfoundation/hardhat-verify");
// require("./tasks/test.ts")
//内置的 Node.js 模块 path 和 fs，用于文件系统操作和路径处理
import path from 'path';
import fs from 'fs';

const tasksArr = ["test"]
tasksArr.forEach((folder) => {
  // ⚠️如果tasks文件下面还有其他文件夹需要加上folder参数
  //  const res = path.join(__dirname, "tasks",folder)
  const res = path.join(__dirname, "tasks")

  fs.readdirSync(res).filter((file) => file.endsWith(".ts")).forEach((file) => {
    require(path.join(res, file))
  }
  )
})
console.log("111");


module.exports = {
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      },
      outputSelection: {
        "*": {
          "*": ["storageLayout"]
        }
      }
    }
  },
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
      chainId: 11155111
    }
  },
  etherscan: {
    apiKey: {
      sepolia: process.env.SEPOLIA_ETHERSCAN_APIKEY
    }
  },
  namedAccounts: {
    //the number of key is chainId of each network 
    deployer: {
      default: 0,//默认网络的第一个账户
      1: 0, //mainnet
      11155111: 0, //sepolia
      5: 0, //goerli
      42: 0 //kovan
    },
    anotherAccount: {
      default: 1,
      1: 1,
      11155111: 1,
      5: 1,
      42: 1
    }

  }
}
