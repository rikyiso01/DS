import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ethers } from "ethers";
import { useMetamask } from "../components/context/MetamaskContext";
import { CONTRACT_ADDRESS, IPFS_BASE_URL } from "../constants";
import abi from "../assets/abi.json";
import { Card, Button } from "@radix-ui/themes";

/** 
 * The contract's Challenge struct now has:
 *   address publicFlag;
 *   uint reward;
 *   uint score;
 *   string ipfscid;
 *
 * We'll fetch them from getChallenges() -> an array of Challenge objects.
 * Then we also fetch from IPFS { name, description, category, problem }.
 */

interface OnChainChallenge {
  publicFlag: string;
  reward: bigint;
  score: bigint;
  ipfscid: string;
}

interface IpfsData {
  name: string;
  description: string;
  category: string;
  problem: string;
}

interface ChallengeData {
  index: number;
  publicFlag: string;
  reward: number;
  score: number;
  name: string;
  description: string;
  category: string;
}

export default function ChallengeDetails() {
  const { id } = useParams(); // e.g. "/challenge/:id"
  const { provider, userAddress } = useMetamask();
  const [challenge, setChallenge] = useState<ChallengeData | null>(null);
  const [loading, setLoading] = useState(true);

  // For the "submit flag" feature:
  const [isSolved, setIsSolved] = useState(false);
  const [userFlag, setUserFlag] = useState("");     // user's typed text in the text area
  const [errorMsg, setErrorMsg] = useState("");     // if submission fails
  const [bgColor, setBgColor] = useState("bg-white");  // default color; if solved => "bg-green-50"

  useEffect(() => {
    if (!provider || !id) return;

    async function loadChallenge() {
      setLoading(true);
      try {
        const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);
        const chainChallenges: OnChainChallenge[] = await contract.getChallenges();

        const challengeId = parseInt(id, 10);
        if (isNaN(challengeId) || challengeId < 0 || challengeId >= chainChallenges.length) {
          console.warn("Invalid challenge ID or out of range");
          setChallenge(null);
          setLoading(false);
          return;
        }

        // Grab the raw challenge data
        const rawC = chainChallenges[challengeId];
        const rewardNum = Number(rawC.reward);
        const scoreNum = Number(rawC.score);

        // Fetch IPFS data
        const cidUrl = IPFS_BASE_URL + rawC.ipfscid;
        const ipfsData: IpfsData = await fetch(cidUrl).then((r) => r.json());

        const merged: ChallengeData = {
          index: challengeId,
          publicFlag: rawC.publicFlag,
          reward: rewardNum,
          score: scoreNum,
          name: ipfsData.name,
          description: ipfsData.description,
          category: ipfsData.category,
        };
        setChallenge(merged);

        // Check if solved
        if (userAddress) {
          const solved: boolean = await contract.isChallengeSolved(userAddress, challengeId);
          setIsSolved(solved);
          if (solved) {
            setBgColor("bg-green-50");
          }
        }
      } catch (err) {
        console.error("Error loading challenge details:", err);
        setChallenge(null);
      }
      setLoading(false);
    }

    loadChallenge();
  }, [provider, userAddress, id]);

  async function handleSubmitFlag() {
    if (!provider || !challenge) return;
    setErrorMsg("");
    try {
      // We need a signer for a transaction
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);

      // userFlag is presumably the signature the user typed
      // call contract.submitFlag(challenge.index, userFlag)
      const tx = await contract.submitFlag(challenge.index, userFlag);
      await tx.wait();

      // If no revert => correct flag
      setIsSolved(true);
      setBgColor("bg-green-50");
    } catch (err: any) {
      console.error("Submit flag error:", err);
      setIsSolved(false);
      setBgColor("bg-white");
      setErrorMsg(`Incorrect solution or transaction failed: ${err.message}`);
    }
  }

  if (loading) {
    return (
      <div className="mt-20 text-center">
        <p>Loading challenge details...</p>
      </div>
    );
  }
  if (!challenge) {
    return (
      <div className="mt-20 text-center">
        <p>Challenge not found or invalid ID!</p>
        <Link to="/challenges" className="underline text-blue-600 block mt-4">
          Go back to challenges
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-20 px-4 max-w-xl mx-auto">
      <Card size="3" variant="surface" className={`p-6 shadow space-y-4 ${bgColor}`}>
        <div>
          <h2 className="text-xl font-semibold">Challenge #{challenge.index}</h2>
          <p className="text-sm text-gray-500">{challenge.name}</p>
        </div>
        <div>
          <p className="text-sm">{challenge.description}</p>
          <p className="text-xs text-muted-foreground mt-2">
            Category: {challenge.category}
          </p>
          <p className="text-xs mt-1">
            Reward: {challenge.reward} wei | Score: {challenge.score}
          </p>
        </div>

        {isSolved ? (
          // If solved => show the correct flag from challenge.publicFlag
          <div>
            <p className="text-sm text-green-700 font-semibold">
              Solved!
            </p>
          </div>
        ) : (
          // If not solved => show text area + button
          <div className="space-y-2">
            <textarea
              className="border w-full p-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              rows={3}
              placeholder="Enter the flag here..."
              value={userFlag}
              onChange={(e) => setUserFlag(e.target.value)}
            />
            <div>
              <Button variant="outline" onClick={handleSubmitFlag}>
                Submit
              </Button>
            </div>
            {errorMsg && (
              <p className="text-red-600 text-sm font-medium mt-2">
                {errorMsg}
              </p>
            )}
          </div>
        )}
      </Card>

      <div className="text-center mt-8">
        <Link
          to="/challenges"
          className="underline text-blue-600 hover:text-blue-400"
        >
          Go back to challenges
        </Link>
      </div>
    </div>
  );
}
