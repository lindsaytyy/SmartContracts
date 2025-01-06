const { ethers } = require("hardhat");
const generateWallets = async (walletNum = 20) => {
    const mnemonic = ethers.Mnemonic.entropyToPhrase(ethers.randomBytes(32))
    const basePath = "44'/60'/0'/0"
    const baseWallet = ethers.HDNodeWallet.fromPhrase(mnemonic, basePath)
    let wallets = [];
    let walletsAddr = []
    for (let i = 0; i < walletNum; i++) {
        const baseWalletNew = baseWallet.derivePath(i.toString());
        //适合用于本地操作或稍后连接提供者 const connectedWallet = walletNew.connect(provider);˝
        const walletNew = new ethers.Wallet(baseWalletNew.privateKey)
        walletsAddr.push(walletNew.address);
        wallets.push(walletNew);
    }
    return {
        wallets,
        walletsAddr
    }
}
module.exports = {
    generateWallets,
};