// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract FrontContract is ERC721 {
    uint256 public _nextTokenId;

    constructor() ERC721("FrontContract", "FC") {
        _nextTokenId = 1; // 假设 token ID 从 1 开始
    }

    // 修改为 non-view 函数，并添加权限控制（例如只有合约所有者可以调用）
    function mint() external {
        require(_nextTokenId <= MAX_TOKEN_ID, "All tokens have been minted");

        // 铸造一个新的 NFT 给消息发送者
        _mint(msg.sender, _nextTokenId);

        // 更新下一个可用的 token ID
        _nextTokenId++;
    }

    // 定义最大 token ID 或其他相关逻辑
    uint256 constant MAX_TOKEN_ID = 10000;
}
