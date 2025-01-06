const { ethers } = require("ethers")
const { multiTransferWithHD } = require("./10_MultiTransferWithHD.ts");
const { canAffordTransaction } = require('../utils/canAffordTransaction.ts')
async function collectionAsset() {
    const { wallets, provider, contractWETH } = await multiTransferWithHD()
    const privateKey = "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d"
    const newWallet = await new ethers.Wallet(privateKey, provider)

    for (let i = 0; i < 20; i++) {
        const eachConnect = await wallets[i].connect(provider)
        try {
            const txPromisesETH = []
            //ETH
            const ifCanAfford = await canAffordTransaction(wallets[i], newWallet.address, 0.1, provider)
            if (!ifCanAfford) {
                console.log("ifCanAfford:", ifCanAfford);
                return
            }
            const txSendETH = {
                to: newWallet.address,
                //这里的value还需要算上gas费用，multiTransferWithHD函数中给每个钱包正好转了10eth，如果这里还写10eth那么gas费就不足了
                value: ethers.parseEther("0.1")
            }

            const tx = await eachConnect.sendTransaction(txSendETH)
            txPromisesETH.push(tx.wait().then(res => {
                console.log(`${i}wallet finish ETH transfer:${res}`);
            }))
            await Promise.all(txPromisesETH)
        } catch (error) {
            console.log("error", error);
        }


    }
    //如果把两种转账写到一个循环里并且使用promise all的话 会报错【error Error: replacement fee too low 】因为上一次转账
    //eth还没完成便开始了下一次erc20代币转账
    for (let i = 0; i < 20; i++) {
        const eachConnect = await wallets[i].connect(provider)
        try {
            //WETH
            const newWETH = await contractWETH.connect(eachConnect)
            const txWETH = await newWETH.transfer(newWallet.address, ethers.parseEther("0.1"))
            await txWETH.wait()
            // // 等待 balanceOf 调用完成，并打印余额
            const balance = await newWETH.balanceOf(newWallet.address);
            console.log("balance", balance);

        } catch (error) {
            console.log(error);

        }
    }
}
collectionAsset()