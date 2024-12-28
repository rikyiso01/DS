import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import { useMetamask } from "../context/MetamaskContext";
import { CONTRACT_ADDRESS, IPFS_BASE_URL } from "../constants";
import abi from "../assets/abi.json";
import { useNotification } from "../context/NotificationContext";

export default function Challenges() {
  const { notify } = useNotification();
  const { provider, userAddress } = useMetamask();
  const navigate = useNavigate();
  const [challenges, setChallenges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Card sub-component
  function ChallengeCard({ challenge }: { challenge: any }) {
    const { index, name, description, reward, category, solved } = challenge;

    return (
      <div
        className={`border rounded p-4 shadow-sm transition hover:shadow-md cursor-pointer ${
          solved ? "bg-green-50" : "bg-white"
        }`}
        onClick={() => navigate(`/challenge/${index}`)}
      >
        <h2 className="text-lg font-semibold mb-1">
          {name}
          {solved && <span className="ml-2 text-xs text-green-600">(solved)</span>}
        </h2>
        <p className="text-sm text-gray-500 mb-2">{description}</p>
        <p className="text-xs">Reward: {reward} wei</p>
        <p className="text-xs">Category: {category}</p>
      </div>
    );
  }

  useEffect(() => {
    if (!userAddress) {
      setLoading(false);
      return;
    }

    (async () => {
      setLoading(true);
      try {
        const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);
        const chainChallenges = await contract.getChallenges();

        const newList: any[] = await Promise.all(
          chainChallenges.map(async (c: any, index: number) => {
            // c => [publicFlag, reward, score, ipfscid]
            const ipfsHash = c[3];
            const ipfsData = await fetch(IPFS_BASE_URL + ipfsHash).then((r) =>
              r.json()
            );
            const solved = await contract.isChallengeSolved(userAddress, index);
            return {
              index,
              name: ipfsData.name,
              description: ipfsData.description,
              category: ipfsData.category,
              reward: Number(c[1]),
              solved,
            };
          })
        );

        setChallenges(newList);
      } catch (err) {
        notify({
          title: "Error Loading Challenges",
          description: "Unable to fetch challenges from the blockchain.",
          type: "error",
        });
        console.error("Error loading challenges:", err);
      }
      setLoading(false);
    })();
  }, [provider, userAddress]);

  if (loading) {
    return <p className="mt-16 text-center">Loading challenges...</p>;
  }

  // If no user connected
  if (!userAddress) {
    return (
      <div className="mt-16 text-center">
        <p className="text-gray-600 mb-4">Please connect your wallet first.</p>
      </div>
    );
  }

  if (challenges.length === 0) {
    return <p className="mt-16 text-center">No challenges found.</p>;
  }

  return (
    <div className="mt-16 px-4">
      <h1 className="text-2xl text-center mb-8 text-sky-500 font-bold">
        Challenges
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {challenges.map((ch) => (
          <ChallengeCard key={ch.index} challenge={ch} />
        ))}
      </div>
    </div>
  );
}
