const { ethers, deployments } = require("hardhat");
const FrontRunning = require('../artifacts/contracts/FrontRunning.sol/FrontContract.json')

async function testFR() {
    const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
    const privateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
    const myWallet = new ethers.Wallet(privateKey, provider)
    const ABI = FrontRunning.abi;
    const addr = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
    const myContract = new ethers.Contract(addr, ABI, myWallet)
    const res = await myContract.mint();
    const resFinished = await res.wait()
    const tokenId = await myContract._nextTokenId();
    console.log("resFinished", resFinished, `\n${tokenId}`);
}
testFR()