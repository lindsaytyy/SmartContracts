const { ethers, deployments } = require("hardhat");
const WETHArtifact = require("../artifacts/contracts/WETH.sol/WETH.json");

async function interfaceTransaction() {
    const myInterface = new ethers.Interface(WETHArtifact.abi)
    const fragMint = await myInterface.getFunction("deposit")
    if (fragMint) {
        const selectorMint = fragMint.selector;
        console.log("selectorMint", selectorMint);//0xd0e30db0
    }

    const provider = new ethers.WebSocketProvider('ws://127.0.0.1:8545')
    provider.on('pending', async (txHash) => {
        if (txHash) {
            const res = await provider.getTransaction(txHash)
            console.log(res);
            const resParse = myInterface.parseTransaction(res)
            //这里的resParse是null因为abi使用的其他合约但是交易是另外一个合约
            console.log("resParse", resParse);
        }
    })

}
interfaceTransaction()