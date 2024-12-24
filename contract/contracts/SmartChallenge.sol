/**
 *Submitted for verification at Etherscan.io on 2024-02-18
*/

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SmartChallenge {
    struct Challenge {
        address publicFlag;
        uint reward;
        uint score;
    }

    struct ChallengesSet{
        mapping(uint=>bool) is_in;
        uint[] values;
    }

    struct Player {
        ChallengesSet solvedChallenges;
    }

    struct PlayersMap{
        mapping(address=>Player) values;
        address[] keys;
        mapping(address=>bool) is_in;
    }

    address public implementation;
    address public owner;
    Challenge[] public challenges;
    PlayersMap players;

    event GetOwner(address owner);
    event ChallengeSubmitted(string returnValue);
    event ChallengeAdded(uint indexed challengeId, address _publicFlag, uint _reward, uint _score);


    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this operation");
        _;
    }

    function getOwner() public view returns (address) {
        return owner;
    }

    function payUser(address payable recipient, uint amount) internal {
        require(address(this).balance >= amount, "Insufficient contract balance");
        recipient.transfer(amount);
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }

    function getMessageHash(
        address _address,
        uint _id
    ) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(_address,_id));
    }

    function getEthSignedMessageHash(bytes32 _messageHash)
        public
        pure
        returns (bytes32)
    {
        /*
        Signature is produced by signing a keccak256 hash with the following format:
        "\x19Ethereum Signed Message\n" + len(msg) + msg
        */
        return keccak256(
            abi.encodePacked("\x19Ethereum Signed Message:\n32", _messageHash)
        );
    }

    function verify(
        address _address,
        uint _id,
        bytes memory signature,
        address _publicFlag
    ) public pure returns (bool) {
        bytes32 messageHash = getMessageHash(_address, _id);
        bytes32 ethSignedMessageHash = getEthSignedMessageHash(messageHash);

        return recoverSigner(ethSignedMessageHash, signature) == _publicFlag;
    }

    function recoverSigner(
        bytes32 _ethSignedMessageHash,
        bytes memory _signature
    ) public pure returns (address) {
        (bytes32 r, bytes32 s, uint8 v) = splitSignature(_signature);

        return ecrecover(_ethSignedMessageHash, v, r, s);
    }

    function splitSignature(bytes memory sig)
        public
        pure
        returns (bytes32 r, bytes32 s, uint8 v)
    {
        require(sig.length == 65, "invalid signature length");

        assembly {
            /*
            First 32 bytes stores the length of the signature

            add(sig, 32) = pointer of sig + 32
            effectively, skips first 32 bytes of signature

            mload(p) loads next 32 bytes starting at the memory address p into memory
            */

            // first 32 bytes, after the length prefix
            r := mload(add(sig, 32))
            // second 32 bytes
            s := mload(add(sig, 64))
            // final byte (first byte of the next 32 bytes)
            v := byte(0, mload(add(sig, 96)))
        }

        // implicitly return (r, s, v)
    }

    function submitFlag(uint _challengeId, bytes memory signature) public {
        require(_challengeId<challenges.length, "Challenge does not exist");
        require(bytes(signature).length > 0, "Flag cannot be empty");
        require(!players.values[msg.sender].solvedChallenges.is_in[_challengeId], "Challenge already solved by this player");

        bool verified=verify(msg.sender,_challengeId, signature, challenges[_challengeId].publicFlag);
        require(verified,"Incorrect Flag!");

        emit ChallengeSubmitted("Correct answer!");
        players.values[msg.sender].solvedChallenges.is_in[_challengeId] = true;
        players.values[msg.sender].solvedChallenges.values.push(_challengeId);

        payUser(payable (msg.sender), challenges[_challengeId].reward);

        if (!players.is_in[msg.sender]) {
            players.is_in[msg.sender]=true;
            players.keys.push(msg.sender);
        }
    }

    function addChallenge(address _flag, uint _reward, uint _score) public payable onlyOwner {
        require(msg.value==_reward,"You need to store the reward in the contract");
        uint challengeId=challenges.length;
        challenges.push(Challenge(_flag, _reward,  _score));
        emit ChallengeAdded(challengeId, _flag, _reward, _score);
    }

    function getChallenges() public view returns (Challenge[] memory) {
        return challenges;
    }

    function getScore(address _player) public view returns (uint) {
        uint result=0;
        for(uint i=0;i<players.values[_player].solvedChallenges.values.length;i++){
            result+=challenges[players.values[_player].solvedChallenges.values[i]].score;
        }
        return result;
    }

    function getPlayers() public view returns (address[] memory) {
        return players.keys;
    }

    function isChallengeSolved(address playerAddress, uint challengeIndex) public view returns (bool) {
        return players.values[playerAddress].solvedChallenges.is_in[challengeIndex];
    }

    function getScores() public view returns (address[] memory, uint[] memory) {
        uint[] memory playerScores = new uint[](players.keys.length);
        for (uint i = 0; i < players.keys.length; i++) {
            playerScores[i]=getScore(players.keys[i]);
        }
        return (players.keys, playerScores);
    }
}
