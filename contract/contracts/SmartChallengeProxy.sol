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

    function _delegate(address _implementation) internal virtual {
        assembly {
            // Copy msg.data. We take full control of memory in this inline assembly
            // block because it will not return to Solidity code. We overwrite the
            // Solidity scratch pad at memory position 0.
            calldatacopy(0, 0, calldatasize())

            // Call the implementation.
            // out and outsize are 0 because we don't know the size yet.
            let result := delegatecall(
                gas(),
                _implementation,
                0,
                calldatasize(),
                0,
                0
            )

            // Copy the returned data.
            returndatacopy(0, 0, returndatasize())

            switch result
            // delegatecall returns 0 on error.
            case 0 {
                revert(0, returndatasize())
            }
            default {
                return(0, returndatasize())
            }
        }
    }

    fallback() external payable {
        _delegate(implementation);
    }

    receive() external payable {
        _delegate(implementation);
    }

    function upgradeTo(address _implementation) public onlyOwner{
        implementation = _implementation;
    }
}
