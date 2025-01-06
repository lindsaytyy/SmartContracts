const { ethers, getNamedAccounts, deployments } = require("hardhat")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy } = deployments
    const { deployer } = await getNamedAccounts()
    const res = await deploy("FrontContract", {
        from: deployer,
        args: [],
        log: true,
    })
}

module.exports.tags = ["FrontContract"]