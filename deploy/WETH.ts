const { ethers, getNamedAccounts, deployments } = require("hardhat")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts()
    const res = await deploy("WETH", {
        from: deployer,
        args: [],
        log: true
    })
    //0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512

}
module.exports.tags = ["WETH"]
