const { ethers, getNamedAccounts, deployments } = require("hardhat")

async function EIP712SigFn() {
    const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545")
    const privateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
    const myWallet = new ethers.Wallet(privateKey, provider)

    const contractName = "EIP712Storage"
    const version = "1"
    const chainId = "31337"
    const contractAddr = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
    const domain = {
        name: contractName,
        version,
        chainId,
        verifyingContract: contractAddr
    }
    const spender = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"
    const number = "100"

    const types = {
        Storage: [
            { name: "spender", type: "address" },
            { name: "number", type: "uint256" }
        ]
    }

    const msg = {
        spender,
        number
    }
    //  myWallet.signTypedData()
    const resSig = await myWallet.signTypedData(domain, types, msg)
    console.log("resSig", resSig);
    //0xa05ddc94ab97af16a538004491557a841cd91de5190489ea45bebcabe1674c60409be32618dfa4dfb8a414442fd69509cc70677d70be517aaba245e11ca4616e1c

    //  ethers.verifyTypedData()
    const resSignerAddr = await ethers.verifyTypedData(domain, types, msg, resSig)
    console.log("resSignerAddr", resSignerAddr);
    //0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266



}
EIP712SigFn()