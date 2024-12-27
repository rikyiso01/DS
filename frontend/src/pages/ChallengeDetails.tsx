import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ethers } from "ethers";
import { useMetamask } from "../components/context/MetamaskContext";
import { CONTRACT_ADDRESS, IPFS_BASE_URL } from "../lib/constants";
import abi from "../assets/abi.json";
import InvisibleDiv from "../components/ui/InvisibleDiv";
import SubmissionForm from "../components/ui/SubmissionForm";

/** 
 * The contract's Challenge struct is:
 * struct Challenge {
 *   address publicFlag;
 *   uint reward;
 *   uint score;
 *   string ipfscid;
 * }
 * 
 * We fetch them from getChallenges()[i], giving us [publicFlag, reward, score, ipfscid].
 * We'll then fetch { name, description, category, problem } from IPFS.
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
  problem: string;
}

export default function ChallengeDetails() {
  const { id } = useParams();          // e.g. "/challenge/:id"
  const { provider, userAddress } = useMetamask();
  const [challenge, setChallenge] = useState<ChallengeData | null>(null);
  const [isSolved, setIsSolved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!provider || !id) return;

    async function loadChallenge() {
      setLoading(true);
      try {
        // Connect to contract
        const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);
        // Fetch all challenges
        const chainChallenges: OnChainChallenge[] = await contract.getChallenges();

        // Parse ID
        const challengeId = parseInt(id, 10);
        if (
          isNaN(challengeId) ||
          challengeId < 0 ||
          challengeId >= chainChallenges.length
        ) {
          console.warn("Invalid challenge ID or out of range");
          setChallenge(null);
          setIsSolved(false);
          setLoading(false);
          return;
        }

        // Grab the on-chain info
        const c = chainChallenges[challengeId];
        const rewardNum = Number(c.reward);
        const scoreNum = Number(c.score);
        const ipfsHash = c.ipfscid; // e.g. "QmSomething"

        // Fetch IPFS data
        const cidUrl = IPFS_BASE_URL + ipfsHash; // e.g. "https://.../Qm..."
        const ipfsRes: IpfsData = await fetch(cidUrl).then((r) => r.json());

        const merged: ChallengeData = {
          index: challengeId,
          publicFlag: c.publicFlag,
          reward: rewardNum,
          score: scoreNum,
          name: ipfsRes.name,
          description: ipfsRes.description,
          category: ipfsRes.category,
          problem: ipfsRes.problem,
        };
        setChallenge(merged);

        // If we have a user, check if it's solved
        if (userAddress) {
          const solved: boolean = await contract.isChallengeSolved(
            userAddress,
            challengeId
          );
          setIsSolved(solved);
        }
      } catch (err) {
        console.error("Error loading challenge details:", err);
        setChallenge(null);
        setIsSolved(false);
      }
      setLoading(false);
    }

    loadChallenge();
  }, [provider, id, userAddress]);

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
        <Link
          to="/challenges"
          className="underline text-blue-600 hover:text-blue-400 block mt-4"
        >
          Go back to challenges
        </Link>
      </div>
    );
  }

  function renderContent() {
    if (isSolved) {
      // If user has solved the challenge, just show a success message or reward info
      return (
        <div className="bg-green-50 p-4 rounded border border-green-200 mt-4 text-green-700">
          <p className="font-semibold">
            You have already solved this challenge!
          </p>
          <p>Reward was: {challenge.reward} wei</p>
          <p>Score: {challenge.score}</p>
        </div>
      );
    } else {
      // If not solved, display the correct form or "InvisibleDiv" based on category
      switch (challenge.category) {
        case "Web":
          return (
            <InvisibleDiv
              challengeKey={challenge.index}
              name={challenge.name}
              problem={challenge.problem}
            />
          );
        case "SQL Injection":
        case "Maths":
        case "Coding":
          return (
            <SubmissionForm
              challengeKey={challenge.index}
              name={challenge.name}
              problem={challenge.problem}
            />
          );
        default:
          return <h2 className="mt-4 text-center">Coming Soon...</h2>;
      }
    }
  }

  return (
    <div className="mt-20 px-4 max-w-2xl mx-auto">
      {/* Basic heading */}
      <h1 className="text-sky-500 text-center mb-4 text-xl font-bold">
        Challenge #{challenge.index}
      </h1>
      <h2 className="text-center mb-4 text-lg text-gray-700">
        {challenge.name}
      </h2>
      <p className="text-sm text-center text-gray-500 mb-4">
        {challenge.description}
      </p>
      <p className="text-sm text-center font-semibold">
        Category: {challenge.category}
      </p>
      {/* Add any extra info about reward/score here if you want */}
      <p className="text-xs text-center">
        Reward: {challenge.reward} wei | Score: {challenge.score}
      </p>

      {/* If solved => show a success box, else show "InvisibleDiv" or "SubmissionForm" */}
      {renderContent()}

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
