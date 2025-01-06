const { ethers } = require("ethers")

async function ERC721fn() {
    const provider = await new ethers.JsonRpcProvider("https://eth-mainnet.g.alchemy.com/v2/YnoZlMwsc4LQZQOiwqaNDqbGe7UTdX9f")
    const abiERC721 = [
        "function name() view returns (string)",
        "function symbol() view returns (string)",
        "function supportsInterface(bytes4) public view returns(bool)",
    ];
    // ERC721的合约地址，这里用的BAYC
    const addressBAYC = "0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d"
    const res = await new ethers.Contract(addressBAYC, abiERC721, provider)
    const name = await res.name()
    const symbol = await res.symbol()
    console.log("name:", name, "symbol:", symbol);
    // ERC721接口的ERC165 identifier
    const selectorERC721 = "0x80ac58cd"
    const isERC721 = await res.supportsInterface(selectorERC721)
    console.log("isERC721", isERC721);
}
ERC721fn()