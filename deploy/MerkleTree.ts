const { ethers, getNamedAccounts, deployments } = require("hardhat")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts()
    const res = await deploy("MerkleTree", {
        from: deployer,
        args: ["TYY", "LJJ", "0xeeefd63003e0e702cb41cd0043015a6e26ddb38073cc6ffeb0ba3e808ba8c097"],
        log: true
    })
    const deployment = await deployments.get("MerkleTree");

}
module.exports.tags = ["MerkleTree"]
