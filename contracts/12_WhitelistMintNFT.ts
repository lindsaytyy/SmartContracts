const { ethers, deployments } = require("hardhat");
// const { merkleFn } = require("../utils/getMerkleTree.ts")
const MerkleTreeArtifact = require("../artifacts/contracts/MerkleTree.sol/MerkleTree.json");
const SignatureNFTArtifact = require("../artifacts/contracts/SignatureNFT.sol/SignatureNFT.json");

async function whitelistMintNFT() {
    const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545")
    const privateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
    const myWallet = await new ethers.Wallet(privateKey, provider)
    /**
     * 通过deployments.get目前还未成功获取合约实例，但是可以放到deploy文件下获取成功
     *  const deployment = await deployments.get("MerkleTree");
    console.log("deployments", deployments);
    const myContract = await ethers.getContractAt("MerkleTree", deployment.address, myWallet)
    const name = await myContract.name()
    console.log("name", name);
     */
    //通过默克尔树proof铸币
    // const contract = await new ethers.Contract("0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512", MerkleTreeArtifact.abi, myWallet)
    // const { proof, tokens } = await merkleFn()
    // const tx = await contract.mint(tokens[3], "3", proof)
    // await tx.wait()
    // console.log(`mint成功，地址${tokens[3]} 的NFT余额: ${await contract.balanceOf(tokens[3])}\n`)
    //mint成功，地址0x5B38Da6a701c568545dCfcB03FcB875f56beddC4 的NFT余额: 1

    //通过签名铸币
    const SignatureNFTContract = await new ethers.Contract("0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0", SignatureNFTArtifact.abi, myWallet)
    const res = await SignatureNFTContract.name()
    console.log("res", res);
    const addr = "0x976EA74026E726554dB657fA54763abd0C3a0aa9"
    const tokenID = "6161"
    const msgHash = await ethers.solidityPackedKeccak256([
        "address", "uint256"
    ], [addr, tokenID])
    const msgHashBYtes = await ethers.getBytes(msgHash)
    const sig = await myWallet.signMessage(msgHashBYtes)
    console.log("sig", sig);
    const txHash = await SignatureNFTContract.mint(addr, tokenID, sig)
    await txHash.wait()
    console.log(`mint成功，地址${addr} 的NFT余额: ${await SignatureNFTContract.balanceOf(addr)}\n`)
    // mint成功，地址0x70997970C51812dc3A010C7d01b50e0d17dc79C8 的NFT余额: 1
}
whitelistMintNFT()