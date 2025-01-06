const { ethers, getNamedAccounts, deployments } = require("hardhat")
module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts()
    const res = await deploy("AirDrop", {
        from: deployer,
        args: [],
        log: true
    })
}
//0x5FbDB2315678afecb367f032d93F642f64180aa3
module.exports.tags = ["AirDrop"]