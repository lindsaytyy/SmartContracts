const { MerkleTree } = require("merkletreejs")
const { ethers } = require("hardhat");

const tokensEXA = [
    "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4",
    "0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2",
    "0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db",
    "0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB"
];
async function merkleFn(tokens = tokensEXA) {
    const leaf = tokens.map(_ => {
        return ethers.keccak256(_)
    })
    //创建Merkle Tree
    const merkletree = new MerkleTree(leaf, ethers.keccak256, { sortPairs: true })
    //获得Merkle Tree的root
    const root = merkletree.getHexRoot()
    //获得第0个叶子节点的proof。
    const proof = merkletree.getHexProof(leaf[3])
    console.log("root", root, "proof", proof, "\nmerkletree", merkletree);
    return {
        root,
        proof,
        tokens
    }

}
merkleFn()
module.exports = {
    merkleFn
}