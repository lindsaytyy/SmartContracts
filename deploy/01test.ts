module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy } = deployments
    const { deployer } = await getNamedAccounts()
    await deploy("TestMockContract", {
        from: deployer,
        args: [],
        log: true,
    })
    console.log("end");
    
}
module.exports.tags = ["TestMockContract"]
