const { deployments, getNamedAccounts, ethers } = require("hardhat")

module.exports = async ({
    getNamedAccounts, deployments
}) => {
    const { deploy } = deployments
    const { deployer } = await getNamedAccounts()
    const res = await deploy("SignatureNFT", {
        from: deployer,
        args: ["TYY", "LJJ", "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"],
        log: true
    })
    module.exports.tags = ["SignatureNFT"]
}