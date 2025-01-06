//SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract WETH is ERC20 {
    constructor() ERC20("WETH", "WETH") {
        _mint(msg.sender, 1000);
    }

    event Deposit(address indexed caller, uint256 amount);
    event WithDraw(address indexed caller, uint256 amount);

    fallback() external payable {
        emit Deposit(msg.sender, msg.value);
    }

    receive() external payable {
        emit Deposit(msg.sender, msg.value);
    }

    function deposit() external payable {
        _mint(msg.sender, msg.value);
        emit Deposit(msg.sender, msg.value);
    }

    function withDraw(uint256 _amount) external payable {
        require(balanceOf(msg.sender) >= _amount, "insufficient balance");
        _burn(msg.sender, _amount);
        emit WithDraw(msg.sender, _amount);
    }
}
