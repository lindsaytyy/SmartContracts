const { task } = require("hardhat/config")
task("isTest", "this is a test")
    .addParam("number", "for testing parameters")
    .setAction(async (params) => {
        console.log("params", params.number);
    })