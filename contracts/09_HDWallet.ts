const { ethers } = require("ethers")
async function HDWalletFn() {
    //  m / purpose' / coin_type' / account' / change / address_index
    // const entropy = ethers.randomBytes(16); // 使用16字节熵生成12个单词的助记词
    // const mnemonic = ethers.Mnemonic.entropyToPhrase(entropy);
    // console.log("mnemonic", mnemonic);

    // //init wallet
    // const myWallet = ethers.Wallet.fromPhrase(mnemonic)
    // const coinType = "60" //以太坊的coin type
    // const accIndex = 0
    // const change = 0 //outside 
    // const addAmount = 20;
    // const addrS = []

    // for (let i = 0; i < addAmount; i++) {
    //     // const path = `m/44'/${coinType}'/${accIndex}'/${change}/${i}`
    //     const path = `m/44'/${coinType}'/${accIndex}'/${change}/${i}`;
    //     const deriveWallet = myWallet.derivePath(path)
    //     const addr = deriveWallet.address;
    //     addrS.push({
    //         index: i,
    //         path: path,
    //         address: addr,
    //         privateKey: deriveWallet.privateKey
    //     })

    // }

    // console.log("addrS", addrS);
    // 生成随机助记词
    const mnemonic = ethers.Mnemonic.entropyToPhrase(ethers.randomBytes(32))
    // 创建HD基钱包
    // 基路径："m / purpose' / coin_type' / account' / change"
    const basePath = "44'/60'/0'/0"
    const baseWallet = ethers.HDNodeWallet.fromPhrase(mnemonic, basePath)
    const numWallet = 20
    // 派生路径：基路径 + "/ address_index"
    // 我们只需要提供最后一位address_index的字符串格式，就可以从baseWallet派生出新钱包。V6中不需要重复提供基路径！
    let wallets = [];
    for (let i = 0; i < numWallet; i++) {
        let baseWalletNew = baseWallet.derivePath(i.toString());
        // console.log(`第${i + 1}个钱包地址： ${baseWalletNew.address}`)
        wallets.push(baseWalletNew);
    }

    //Creates an HD Node from a mnemonic phrase.
    const encryptWallet = ethers.Wallet.fromPhrase(mnemonic)
    const pwd = "1997"
    const json = await encryptWallet.encrypt(pwd)

    const resWallet = await ethers.Wallet.fromEncryptedJson(json, pwd)
    return wallets
}
HDWalletFn()