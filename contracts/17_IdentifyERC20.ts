const { ethers, deployments } = require("hardhat");

async function IdentifyERC20() {
    //transfer  a9059cbb  ; totalSupply  18160ddd
    const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
    const byteCode20 = await provider.getCode("0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9")
    const byteCode721 = await provider.getCode("0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512")
    if (byteCode20 != "0x" && byteCode721 != "0x") {
        const res20 = byteCode20.includes("18160ddd") && byteCode20.includes("a9059cbb")
        const res721 = byteCode721.includes("18160ddd") && byteCode20.includes("a9059cbb")
        console.log("res20", res20, "\nres721", res721) //true false
    }

}
IdentifyERC20()