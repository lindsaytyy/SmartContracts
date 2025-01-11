// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;
import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract EIP712Storage is EIP712 {
    using ECDSA for bytes32;
    // bytes32 private constant EIP712DOMAIN_TYPEHASH =
    //     keccak256(
    //         "EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"
    //     );
    bytes32 private constant STORAGE_TYPEHASH =
        keccak256("Storage(address spender,uint256 number)");
    bytes32 private DOMAIN_SEPARATOR;
    uint256 private number;
    address owner;

    constructor() EIP712("EIP712Storage", "1") {
        owner = msg.sender;
    }

    // constructor() {
    //     //在 EIP-712 中，域分隔符是通过将类型哈希（EIP712DOMAIN_TYPEHASH）和所有字段值一起编码生成的
    //     DOMAIN_SEPARATOR = keccak256(
    //         abi.encode(
    //             EIP712DOMAIN_TYPEHASH, // type hash
    //             keccak256(bytes("EIP712Storage")), // name
    //             keccak256(bytes("1")), // version
    //             block.chainid, // chain id
    //             address(this) // contract address
    //         )
    //     );
    //     owner = msg.sender;
    // }
    //_hashTypedDataV4：这是 OpenZeppelin 提供的一个辅助函数，
    //用来根据 EIP-712 标准构造消息哈希（digest）。它内部已经包含了 \x19\x01 和 DOMAIN_SEPARATOR 的处理。
    event PermitStored(
        address indexed signer,
        address indexed spender,
        uint256 num
    );
    function permitStore(
        uint256 _num,
        bytes memory _signature,
        address _spender
    ) public {
        // 构造 digest
        bytes32 digest = _hashTypedDataV4(
            keccak256(abi.encode(STORAGE_TYPEHASH, _spender, _num))
        );

        // 恢复签名者
        address signer = digest.recover(_signature);

        // 检查签名
        require(signer == owner, "EIP712Storage: Invalid signature");

        // 更新状态
        number = _num;

        emit PermitStored(signer, _spender, _num);
    }

    /* function permitStore(
        uint256 _num,
        bytes memory _signature,
        address _spender
    ) public {
        // 检查签名长度，65是标准r,s,v签名的长度
        require(_signature.length == 65, "invalid signature length");
        bytes32 r;
        bytes32 s;
        uint8 v;
        // 目前只能用assembly (内联汇编)来从签名中获得r,s,v的值
        assembly {
            // 读取长度数据后的32 bytes
            r := mload(add(_signature, 0x20))
            // 读取之后的32 bytes
            s := mload(add(_signature, 0x40))
            // 读取最后一个byte
            v := byte(0, mload(add(_signature, 0x60)))
        }

        bytes32 digest = keccak256(
            abi.encodePacked(
                "\x19\x01", //表示这是一个 EIP-712 签名
                DOMAIN_SEPARATOR, //域分隔符
                keccak256(abi.encode(STORAGE_TYPEHASH, _spender, _num)) //类型化数据哈希
            )
        );

        address signer = digest.recover(v, r, s); // 恢复签名者
        require(signer == owner, "EIP712Storage: Invalid signature"); // 检查签名
        number = _num;
    }
    **/
    function retrieve() public view returns (uint256) {
        return number;
    }
}
