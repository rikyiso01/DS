import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import { useMetamask } from "../components/context/MetamaskContext";
import { CONTRACT_ADDRESS, IPFS_BASE_URL } from "../constants";
import abi from "../assets/abi.json";
import AddChallenge from "../components/ui/AddChallenge";

// A simple "card" to display each challenge preview
function ChallengeCard({
  challenge,
  onClick,
}: {
  challenge: any;
  onClick: () => void;
}) {
  const { key, name, description, reward, category, solved } = challenge;
  return (
    <div
      className={`border rounded p-4 shadow-sm transition hover:shadow-md cursor-pointer ${
        solved ? "bg-green-50" : "bg-white"
      }`}
      onClick={onClick}
    >
      <h2 className="text-lg font-semibold mb-1">
        {name}
        {solved && <span className="ml-2 text-xs text-green-600">(solved)</span>}
      </h2>
      <p className="text-sm text-gray-500 mb-2">{description}</p>
      <p className="text-xs">
        <span className="font-medium">Reward:</span> {reward} wei
      </p>
      <p className="text-xs">
        <span className="font-medium">Category:</span> {category}
      </p>
    </div>
  );
}

export default function Challenges() {
  const navigate = useNavigate();
  const { provider, userAddress } = useMetamask();
  const [challenges, setChallenges] = useState<any[]>([]);
  const [owner, setOwner] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!provider || !userAddress) {
      navigate("/login");
      return;
    }

    (async () => {
      setLoading(true);
      try {
        const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);

        // fetch the contract owner
        const _owner = await contract.getOwner();
        setOwner(_owner);

        // getChallenges() -> returns array of [publicFlag, reward, score, ipfsHash]
        const chainChallenges = await contract.getChallenges();

        const newList: any[] = [];
        for (let i = 0; i < chainChallenges.length; i++) {
          const c = chainChallenges[i];
          // c[3] is IPFS hash
          const ipfsHash = c[3];
          const cidUrl = IPFS_BASE_URL + ipfsHash;
          // fetch name, desc, category from IPFS
          const data = await fetch(cidUrl).then((r) => r.json());

          // check if solved
          const solved = await contract.isChallengeSolved(userAddress, i);

          newList.push({
            key: i,
            reward: Number(c[1]),
            name: data.name,
            description: data.description,
            category: data.category,
            solved,
          });
        }

        setChallenges(newList);
      } catch (err) {
        console.error("Error loading challenges:", err);
      }
      setLoading(false);
    })();
  }, [provider, userAddress, navigate]);

  if (loading) {
    return <p className="mt-20 text-center">Loading challenges...</p>;
  }

  function handleChallengeClick(challenge: any) {
    navigate(`/challenge/${challenge.key}`);
  }

  return (
    <div className="mt-20 px-4">
      <h1 className="text-2xl text-center mb-4 text-sky-500 font-bold">
        Challenges
      </h1>

      {challenges.length === 0 && (
        <p className="text-center mt-8">No challenges found.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {challenges.map((challenge) => (
          <ChallengeCard
            key={challenge.key}
            challenge={challenge}
            onClick={() => handleChallengeClick(challenge)}
          />
        ))}
      </div>
    </div>
  );
}
