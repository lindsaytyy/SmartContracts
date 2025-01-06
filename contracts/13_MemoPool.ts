const { ethers, deployments } = require("hardhat");

function throttle(fn, delay) {
    let timer;
    return function () {
        if (!timer) {
            fn.apply(this, arguments)
            timer = setTimeout(() => {
                clearTimeout(timer)
                timer = null
            }, delay)
        }
    }
}
async function memoPollFn() {
    const provider = new ethers.WebSocketProvider('ws://127.0.0.1:8545')
    let i = 0;
    //pending事件：该事件在新的交易被添加到区块链时触发。
    provider.on("pending", async (txHash) => {
        if (txHash && i < 100) {
            console.log(`[${(new Date).toLocaleTimeString()}] 监听Pending交易 ${i}: ${txHash} \r`);
            i++;
        }
    })

    let j = 0;
    provider.on("pending", throttle(async (txHash) => {
        if (txHash && j < 100) {
            let tx = await provider.getTransaction(txHash)
            console.log(`\n[${(new Date).toLocaleTimeString()}] 监听Pending交易 ${j}: ${txHash} \r`);
            console.log(tx);
            j++
        }

    }, 1000))
}
memoPollFn()