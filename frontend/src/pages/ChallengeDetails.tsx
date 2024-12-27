import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS } from "../lib/constants";
import abi from "../assets/abi.json";

export default function ChallengeDetails() {
  const { id } = useParams();
  const [challenge, setChallenge] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    (async () => {
      setLoading(true);
      try {
        const provider = new ethers.InfuraProvider("goerli", "YOUR_INFURA_KEY");
        const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);

        const allChallenges = await contract.getChallenges();
        const target = allChallenges.find((c: any[]) => c[0].toString() === id);
        if (target) {
          const pinataBase = "https://gateway.pinata.cloud/ipfs/";
          const cidUrl = pinataBase + target[3];
          const data = await fetch(cidUrl).then((r) => r.json());
          setChallenge({
            key: +target[0],
            reward: +target[2],
            name: data.name,
            description: data.description,
            category: data.category,
            problem: data.problem,
          });
        }
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    })();
  }, [id]);

  if (loading) return <p>Loading challenge...</p>;
  if (!challenge) return <p>Challenge not found!</p>;

  return (
    <div>
      <h1 className="text-xl text-center mb-2">Challenge #{challenge.key}</h1>
      <p className="text-center mb-4">{challenge.description}</p>
      {/* If category === "Web", show InvisibleDiv, else show SubmissionForm, etc. */}
      <p className="text-center">Category: {challenge.category}</p>
      {/* Insert your old logic for "InvisibleDiv" or "SubmissionForm" here, or do it inline */}
      <div className="text-center mt-4">
        <Link to="/challenges" className="underline text-blue-600">
          Back
        </Link>
      </div>
    </div>
  );
}
