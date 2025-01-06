// const { ethers } = require("ethers")

// const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545")
const ALCHEMY_MAINNET_URL = 'https://rpc.ankr.com/eth';
const ALCHEMY_SEPOLIA_URL = 'https://rpc.sepolia.org';

const providerETH = new ethers.JsonRpcProvider(ALCHEMY_MAINNET_URL)
const providerSEPOLIA = new ethers.JsonRpcProvider(ALCHEMY_SEPOLIA_URL)

async function main() {
    const res = await provider.listAccounts()
    const acc = res[0]
    const accBalance = await provider.getBalance(acc)

    const resETH = await providerETH.getBalance(`vitalik.eth`)
    const resSep = await providerSEPOLIA.getBalance(`0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045`)

    console.log("accBalance", accBalance, `${ethers.formatEther(accBalance)} ETH`);
    // 将余额输出在console（主网）
    console.log(`ETH Balance of vitalik: ${ethers.formatEther(resETH)} ETH`);
    // 输出Sepolia测试网ETH余额
    console.log(`Sepolia ETH Balance of vitalik: ${ethers.formatEther(resSep)} ETH`);

    const network = await providerETH.getNetwork();
    console.log(network.toJSON());
    const resBlock = await providerETH.getBlockNumber()
    console.log(resBlock);
    const resTr = await providerETH.getTransactionCount("vitalik.eth")
    console.log(resTr);
    const resFee = await providerETH.getFeeData()
    console.log("resFee", resFee);

}
main()