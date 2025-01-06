const { ethers } = require("ethers")
const { generateWallets } = require("../utils/generateHDWallets.ts");
async function multiTransferWithHD() {
    //wallet
    const { walletsAddr, wallets } = await generateWallets()
    const amounts = Array(20).fill(ethers.parseEther("1"))
    console.log("walletsAddr", walletsAddr);

    const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545")
    const privateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
    //可以直接用于与以太坊网络进行交互
    const myWallet = await new ethers.Wallet(privateKey, provider)
    //contract
    const abiERC20 = [
        "function balanceOf(address) public view returns (uint256)",
        "function transfer(address, uint256) public returns (bool)",
        "function approve(address, uint256) public returns (bool)",
        "function allowance(address owner, address spender) public view returns (uint256)", // 添加此行
        "event Transfer(address indexed from, address indexed to, uint256 value)",
        "event Approval(address indexed owner, address indexed spender, uint256 value)"
    ];

    const abiWETH = [
        ...abiERC20,
        "function deposit() external payable",
        "function withdraw(uint256) external",
        "event Deposit(address indexed caller, uint256 amount)",
        "event Withdrawal(address indexed caller, uint256 amount)"
    ];
    const abiAirDrop = [
        "function transferERC20(address,address[],uint256[]) external",
        "function transferETH(address[],uint256[]) external payable",
    ]
    const addrWETH = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
    const addrAirDrop = "0x5FbDB2315678afecb367f032d93F642f64180aa3"

    const contractWETH = await new ethers.Contract(addrWETH, abiWETH, myWallet)
    const contractAirDrop = await new ethers.Contract(addrAirDrop, abiAirDrop, myWallet)

    const addr = walletsAddr[10]
    const depositAmount = ethers.parseEther("20");

    const tx = await contractWETH.deposit({ value: depositAmount })
    await tx.wait()

    const resApprove = await contractWETH.approve(addrAirDrop, depositAmount)
    await resApprove.wait()
    const Approved = await contractWETH.allowance("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", addrAirDrop)
    console.log("Approved", ethers.formatEther(Approved));

    //ETH
    const resMultiTransETH = await contractAirDrop.transferETH(walletsAddr, amounts, { value: depositAmount })
    await resMultiTransETH.wait()
    const balanceETH = await provider.getBalance(addr)
    console.log(`ETH持仓: ${ethers.formatEther(balanceETH)}\n`)

    //ERC20
    const resMultiERC20 = await contractAirDrop.transferERC20(addrWETH, walletsAddr, amounts)
    await resMultiERC20.wait()
    const balanceERC20 = await contractWETH.balanceOf(addr)
    console.log(`ERC20持仓: ${ethers.formatEther(balanceERC20)}\n`)

    return {
        myWallet,
        walletsAddr,
        amounts,
        provider,
        wallets,
        contractWETH
    }

}
// multiTransferWithHD()
module.exports = {
    multiTransferWithHD
}