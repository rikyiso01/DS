/**
 *Submitted for verification at Etherscan.io on 2024-02-18
*/

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SmartChallengeProxy {
    address public implementation;
    address public owner;

    constructor(address _implementation) {
        owner = msg.sender;
        upgradeTo(_implementation);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this operation");
        _;
    }

    function _delegate() private {
        (bool ok,) = implementation.delegatecall(msg.data);
        require(ok, "delegatecall failed");
    }

    fallback() external payable {
        _delegate();
    }

    receive() external payable {
        _delegate();
    }

    function upgradeTo(address _implementation) public onlyOwner{
        implementation = _implementation;
        (bool ok,) = implementation.delegatecall(abi.encodeWithSignature("initialize(address)",msg.sender));
        require(ok, "delegatecall failed");
    }
}
