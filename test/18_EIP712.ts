import { version } from "ethers";
import keccak256 from "keccak256";
const { expect } = require("chai");
const { ethers } = require("hardhat");

// const { Signature, verifyMessage } = require("ethers");

describe("EIP712 Contract", function () {
    let EIP712, owner, address1, address2;
    const spender = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"
    beforeEach(async function () {
        [owner, address1, address2] = await ethers.getSigners();
        const insMyContract = await ethers.getContractFactory("EIP712Storage")
        EIP712 = await insMyContract.deploy()
        await EIP712.waitForDeployment()
    })
    describe("permitStore", function () {
        it("it should be reverted with mismatch length of _signature", async function () {
            expect(await EIP712.connect(owner).permitStore(100, "0x", spender)).to.be.revertedWith("invalid signature length")
        })

        it("should change number correctly", async function () {
            //get sig
            const number = 100;

            const domain = {
                name: 'EIP712Storage',
                version: '1',
                chainId: "31337",
                verifyingContract: EIP712.target
            }

            const types = {
                Storage: [
                    { name: "spender", type: "address" },
                    { name: "number", type: "uint256" },
                ]
            }
            const msg = {
                spender,
                number,
            };
            const resSig = await owner.signTypedData(domain, types, msg)
            const resAddr = await EIP712.connect(owner).permitStore(100, resSig, spender)
            await resAddr.wait()

            const resNumber = await EIP712.retrieve()
            expect(resNumber).to.be.equal(number)
        })

        it("should be reverted with invalid signature", async function () {
            const resSig = "0x1b50e0d17dc79C80"
            expect(await EIP712.connect(owner).permitStore(100, resSig, spender)).to.be.revertedWith("invalid signature")

        })
    })

})