const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AirDrop Contract", function () {
    let airDrop, deployer, user1, user2
    beforeEach(async function () {
        const AirDrop = await ethers.getContractFactory("AirDrop")
        airDrop = await AirDrop.deploy()
        await airDrop.waitForDeployment(); //⚠️ethets v6 等待合约部署完成
    })
    describe("transferETH", function () {
        const amounts = [ethers.parseEther("0.1"), ethers.parseEther('0.2')]
        const initFn = async () => {
            [deployer] = await ethers.getSigners();
            // 创建新的随机钱包，并将它们连接到当前的 provider
            const wallet1 = ethers.Wallet.createRandom().connect(ethers.provider);
            const wallet2 = ethers.Wallet.createRandom().connect(ethers.provider);
            // 将新钱包赋值给 user1 和 user2
            user1 = wallet1;
            user2 = wallet2;
            console.log("User1 address:", user1.address);
            console.log("User2 address:", user2.address);
        }

        beforeEach(async function () {
            await initFn();
        });

        it("should transfer ETH to multiple address", async function () {
            const recipients = [user1.address, user2.address]
            const res = await airDrop.connect(deployer)
                .transferETH(recipients, amounts, { value: ethers.parseEther("0.3") })
            await res.wait()

            for (let i = 0; i < recipients.length; i++) {
                const res = await ethers.provider.getBalance(recipients[i])
                console.log("eth res", res);
                expect(res).to.equal(amounts[i])
            }
        })
        it("should failed if over transfer", async function () {
            const recipients = [user1.address, user2.address]
            expect(airDrop.connect(deployer)
                .transferETH(recipients, amounts, { value: ethers.parseEther("0.2") })
            ).to.be.revertedWith("sum of transfer did not approve")
        })

    })
    describe("transferERC20", function () {
        let weth;

        async function setupContracts() {
            [deployer, user1, user2] = await ethers.getSigners();
            const WETH = await ethers.getContractFactory('WETH');
            weth = await WETH.deploy();
            await weth.waitForDeployment(); // 等待合约部署完成
            await weth.connect(deployer).deposit({ value: ethers.parseEther("10") });
        }

        beforeEach(async function () {
            await setupContracts();
        });

        it("should transfer ERC20 to multiple address", async function () {
            //⚠️涉及到异步获取数据的都要放到异步函数中而不能提取到外层作为同步逻辑 否则会undefined error
            //⚠️describe && it 本身都不是async操作
            const recipients = [user1.address, user2.address];
            const amounts = [ethers.parseEther("1"), ethers.parseEther("2")];
            await weth.approve(airDrop.target, ethers.parseEther('10'))
            const res = await airDrop.connect(deployer).transferERC20(weth.target, recipients, amounts)
            //⚠️需要等合约交易完成才可以查询余额 否则余额始终为0
            await res.wait()

            for (let i = 0; i < recipients.length; i++) {
                const res = await weth.balanceOf(recipients[i])
                expect(res).to.equal(amounts[i])

            }
            const resAll = await weth.allowance(deployer, airDrop.target)
            console.log("resAll", resAll);
            expect(resAll).to.equal(ethers.parseEther("7"))
        })
        it("should be reverted under insufficient value", async function () {
            const recipients = [user1.address, user2.address];
            const amounts = [ethers.parseEther("1"), ethers.parseEther("2")]
            const res = await weth.connect(deployer).approve(airDrop.target, ethers.parseEther('1'))
            await res.wait()
            const resAll = await weth.allowance(deployer, airDrop.target)
            console.log("resAll", resAll);
            //⚠️expect 需要回滚的都不可以用【await】 否则报错无法回滚
            expect(
                airDrop.connect(deployer).transferERC20(weth.target, recipients, amounts)
            ).to.be.revertedWith("sum of transfer mismatch the balance of approved");
        });
    })

})