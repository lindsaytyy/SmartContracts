const { ethers } = require("ethers");

async function canAffordTransaction(wallet, recipientAddress, amount, provider) {
    try {
        // 使用 parseUnits 将金额转换为 wei
        let transferAmountWei = ethers.parseUnits(amount.toString(), 'ether');
        console.log("transferAmountWei", transferAmountWei);

        // 将钱包实例与 Provider 连接
        const connectedWallet = wallet.connect(provider);

        // Step 1: Estimate the gas limit for the transaction
        let tx = {
            to: recipientAddress,
            value: transferAmountWei
        };
        let estimatedGasLimit = await connectedWallet.estimateGas(tx);

        // Step 2: Get the current gas price
        let feeData = await provider.getFeeData();
        let gasPrice = feeData.maxFeePerGas ?? feeData.gasPrice;
        if (!gasPrice) throw new Error("Could not fetch gas price");

        // 确保 estimatedGasLimit 和 gasPrice 都是 BigInt
        estimatedGasLimit = BigInt(estimatedGasLimit);
        gasPrice = BigInt(gasPrice);

        // Step 3: Calculate total cost of the transaction in wei
        // 注意：这里我们假设 maxPriorityFeePerGas 不是必须的，如果是 EIP-1559 交易则需要考虑。
        let totalCostWei = estimatedGasLimit * gasPrice + transferAmountWei;

        // Step 4: Check if the sender has enough balance
        let balance = await provider.getBalance(connectedWallet.address);
        return balance >= totalCostWei; // returns true if balance >= totalCostWei
    } catch (error) {
        console.error("Error estimating transaction cost:", error);
        throw error;
    }
}

module.exports = {
    canAffordTransaction
};