/**
 *Submitted for verification at Etherscan.io on 2024-02-18
*/

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SmartChallenge {
    struct Challenge {
        uint challengeId;
        string flagHash;
        uint8 reward;
        string hash;
    }

    struct Player {
        bool isRegistered;
        uint256 score;
        mapping(uint => bool) solvedChallenges;
        string hash;
    }

    mapping(uint => Challenge) public challenges;
    mapping(address => Player) public players;
    address[] public playerAddresses;
    address payable owner;
    uint8 public constant costFlagSend = 1;

    uint32 public challengeCounter;

    event ChallengeSubmitted(string returnValue);
    event ChallengeAdded(uint256 indexed challengeId, string _flag, uint256 _reward, string _hash);

    constructor() payable {
        owner = payable(msg.sender);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this operation");
        _;
    }

    function getOwner() public view returns (address) {
        return owner;
    }

    function payUser(address payable recipient, uint8 amount) internal {
        require(address(this).balance >= amount, "Insufficient contract balance");
        recipient.transfer(amount);
    }

    function submitFlag(uint _challengeId, string memory _flag) public payable {
        require(challenges[_challengeId].challengeId == _challengeId, "Challenge does not exist");
        require(bytes(_flag).length > 0, "Flag cannot be empty");
        require(!players[msg.sender].solvedChallenges[_challengeId], "Challenge already solved by this player");
        require (msg.value >= costFlagSend, "Not enough wei to submit");
        if(keccak256(abi.encodePacked(challenges[_challengeId].flagHash)) == keccak256(abi.encodePacked(_flag))){
            emit ChallengeSubmitted("Correct answer!");
            players[msg.sender].solvedChallenges[_challengeId] = true;
            players[msg.sender].score += challenges[_challengeId].reward;

            payUser(payable (msg.sender), challenges[_challengeId].reward);

            if (!players[msg.sender].isRegistered) {
                players[msg.sender].isRegistered = true;
                playerAddresses.push(msg.sender);
            }
        } else{
            emit ChallengeSubmitted("Incorrect Flag!");
        }
    }

    function addChallenge(string memory _flag, uint8 _reward, string memory _hash) public onlyOwner {
        require(bytes(_flag).length > 0, "Flag cannot be empty");
        challenges[challengeCounter] = Challenge(challengeCounter, _flag, _reward,  _hash);
        challengeCounter++;
        emit ChallengeAdded(challengeCounter, _flag, _reward, _hash);
    }

    function updatePlayer(string memory _hash) public{
        players[msg.sender].hash = _hash;
    }

    function getPlayer() public view returns (string memory) {
        Player storage player = players[msg.sender];
        return (player.hash);
    }

    function getChallenges() public view returns (Challenge[] memory) {
        Challenge[] memory allChallenges = new Challenge[](challengeCounter);

        for (uint i = 0; i < challengeCounter; i++) {
            allChallenges[i] = challenges[i];
        }
        return allChallenges;
    }

    function getScore(address _player) public view returns (uint) {
        return players[_player].score;
    }

    function getPlayers() public view returns (address[] memory) {
        return playerAddresses;
    }

    function IsChallengeSolved(address playerAddress, uint challengeIndex) public view returns (bool) {
        return players[playerAddress].solvedChallenges[challengeIndex];
    }

    function getScores() public view returns (address[] memory, uint[] memory) {
        uint[] memory playerScores = new uint[](playerAddresses.length);
        for (uint i = 0; i < playerAddresses.length; i++) {
            playerScores[i] = players[playerAddresses[i]].score;
        }
        return (playerAddresses, playerScores);
    }

    function withdraw() public payable onlyOwner {
        uint256 balance = address(this).balance;
        require (balance > 0, "The balance is zero, nothing to transfer");
        owner.transfer(balance);
    }
}