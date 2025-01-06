const { ethers } = require("ethers")

async function classTest() {
    const providerUrl = 'http://127.0.0.1:8545';
    const privateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
    const privateKey2 = "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d"
    const provider = new ethers.JsonRpcProvider(providerUrl);

    const signer = await provider.getSigner(1)
    //getSigner如果不穿参数则默认是第一个地址
    console.log("signer", signer);
    const wal = new ethers.Wallet(privateKey, provider)
    const wal2 = new ethers.Wallet(privateKey2, provider)
    console.log(wal, wal2);
    const tx = {
        to: wal2.getAddress(),
        value: 90
    }
    /**  res.wait() 是一个额外的步骤，它会让程序等待直到交易被矿工确认并被打包进某个区块。
     * 这个方法通常接受一个可选参数，表示你想要等待多少个确认（即多少个新区块建立在这个包含你的交易的区块之上）。
     * 如果不传递任何参数，默认情况下它会等待一次确认8。
     * 如果你需要确保转账已经完成才能进行下一步操作，那么你应该保留 await res.wait()*/
    const res = await wal.sendTransaction(tx)
    // await res.wait()
    console.log("sendTransaction", res);
}
classTest()
