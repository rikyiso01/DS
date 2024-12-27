import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import { useMetamask } from "../components/context/MetamaskContext";
import { CONTRACT_ADDRESS, IPFS_BASE_URL } from "../lib/constants"; // or define
import abi from "../assets/abi.json";
import AddChallenge from "../components/ui/AddChallenge"; // You can adapt
import ChallengeCard from "../components/ui/ChallengeCard"; 
// or inline if you prefer

export default function Challenges() {
  const navigate = useNavigate();
  const { provider, userAddress } = useMetamask();
  const [challenges, setChallenges] = useState<any[]>([]);
  const [owner, setOwner] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!provider) {
      navigate("/login");
      return;
    }

    if (!userAddress) {
      navigate("/login");
      return;
    }
    (async () => {
      try {
        const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);
        const owner = await contract.owner();
        setOwner(owner);
        const chainChallenges = await contract.getChallenges();
        const list = await Promise.all(
          chainChallenges.map(async (ch: any[]) => {
            const cidUrl = IPFS_BASE_URL + ch[3];
            const data = await fetch(cidUrl).then((r) => r.json());
            return {
              key: +ch[0],
              reward: +ch[2],
              name: data.name,
              description: data.description,
              category: data.category,
            };
          })
        );
        setChallenges(list);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    })();
  }, [provider, userAddress, navigate]);

  if (loading) return <p>Loading challenges...</p>;

  return (
    <div>
      <h1 className="text-2xl text-center mb-4">Challenges</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {challenges.map((challenge) => (
          <ChallengeCard key={challenge.key} challenge={challenge} userAddress={userAddress} />
        ))}
      </div>
      {userAddress.toLowerCase() === owner.toLowerCase() && (
        <AddChallenge />
      )}
    </div>
  );
}
