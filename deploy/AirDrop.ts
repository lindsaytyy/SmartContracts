import { HardhatRuntimeEnvironment } from "hardhat/types";
declare var hre: HardhatRuntimeEnvironment;
const { network } = require("hardhat")
const verifyDeployments = require("../utils/deployUtils")
module.exports = async ({ getNamedAccounts, deployments }) => {

    const { deploy } = deployments;
    // "deployer" is defined in "hardhat config", 
    // its just a key,you can change it to any other variable
    const { deployer } = await getNamedAccounts()
    const res = await deploy("AirDrop", {
        from: deployer,
        args: [],
        log: true,
    })

    let mockContractaddr
    if (network.name === "hardhat") {
        mockContractaddr = await deployments.get("TestMockContract")
    } else {
        mockContractaddr = "......"
    }

    const resEnv = await hre.network.config.chainId
    if (resEnv !== 11155111) return
    await verifyDeployments(res.address, [])
}
module.exports.tags = ["AirDrop"]