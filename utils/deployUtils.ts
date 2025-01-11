
module.exports = async function verifyDeployments(addr: string, param: any[]) {
    await hre.run("verify:verify", {
        address: addr,
        constructorArguments: param
    })
}

