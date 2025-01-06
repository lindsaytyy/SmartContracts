const { ethers, deployments } = require("hardhat");

async function getStorage() {
    const provider = new ethers.JsonRpcProvider("https://eth-mainnet.g.alchemy.com/v2/YnoZlMwsc4LQZQOiwqaNDqbGe7UTdX9f")
    const addressBridge = '0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a' // DAI Contract
    // 合约所有者 slot
    const slot = `0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103`

    const res = await provider.getStorage(addressBridge, slot)
    console.log("res", res)
    //0x000000000000000000000000554723262467f125ac9e1cdfa9ce15cc53822dbd


}
getStorage()