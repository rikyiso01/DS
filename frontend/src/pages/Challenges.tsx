import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import { useUser } from "../components/context/UserContext";
import { CONTRACT_ADDRESS } from "../lib/constants"; // or define
import abi from "../assets/abi.json";
import AddChallenge from "../components/ui/AddChallenge"; // You can adapt
import ChallengeCard from "../components/ui/ChallengeCard"; 
// or inline if you prefer

export default function Challenges() {
  const navigate = useNavigate();
  const { userAddress } = useUser();
  const [challenges, setChallenges] = useState<any[]>([]);
  const [owner, setOwner] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userAddress) {
      navigate("/login");
      return;
    }
    (async () => {
      try {
        const provider = new ethers.InfuraProvider("goerli", "YOUR_INFURA_KEY");
        const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);
        const own = await contract.getOwner();
        setOwner(own);

        const chainChallenges = await contract.getChallenges();
        // Suppose each challenge = [id, ???, reward, ipfsHash]
        const pinataBase = "https://gateway.pinata.cloud/ipfs/";

        const list = await Promise.all(
          chainChallenges.map(async (ch: any[]) => {
            const cidUrl = pinataBase + ch[3];
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
  }, [userAddress, navigate]);

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
