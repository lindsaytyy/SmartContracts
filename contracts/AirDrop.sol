//SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract AirDrop {
    function getSum(
        uint256[] calldata _addr
    ) private pure returns (uint256 sum) {
        for (uint256 i; i < _addr.length; i++) {
            sum = sum + _addr[i];
        }
    }

    event TransferETH(address addr, uint256 amount);

    function transferETH(
        address[] calldata _addr,
        uint256[] calldata _num
    ) external payable {
        require(_addr.length == _num.length, "length did not match");
        uint256 sumTrans = getSum(_num);
        require(sumTrans <= msg.value, "sum of transfer did not approve");
        for (uint256 i; i < _addr.length; i++) {
            /**
            transfer：适用于简单的转账场景，自带防重入保护，但有 gas 限制。
call        ：更灵活，但需要额外的安全措施来防范重入攻击和其他潜在问题。
             */
            // payable(_addr[i]).transfer(_num[i]); // dos attack
            (bool success, ) = _addr[i].call{value: _num[i]}(""); //reentrancy attack
            require(success, "transferETH failed");
        }
    }

    function transferERC20(
        address _token,
        address[] calldata _addr,
        uint256[] calldata _num
    ) external {
        require(_addr.length == _num.length, "length did not match");
        IERC20 token = IERC20(_token);
        uint256 sumApprove = getSum(_num);
        require(
            token.allowance(msg.sender, address(this)) >= sumApprove,
            "sum of transfer mismatch the balance of approved"
        );

        for (uint256 i; i < _addr.length; i++) {
            token.transferFrom(msg.sender, _addr[i], _num[i]);
        }
    }
}
