import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import {Web3} from "web3";
import { useMetamask } from "../context/MetamaskContext";
import { CONTRACT_ADDRESS, IPFS_BASE_URL } from "../constants";
import abi from "../assets/abi.json";
import { Button, Card } from "@radix-ui/themes";
import { useNotification } from "../context/NotificationContext";

const web3 = new Web3(Web3.givenProvider);

export default function ChallengeDetails() {
  const { notify } = useNotification();
  const { id } = useParams();
  const navigate = useNavigate();
  const { provider, userAddress } = useMetamask();

  const [challengeData, setChallengeData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userFlag, setUserFlag] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isSolved, setIsSolved] = useState(false);

  useEffect(() => {
    if (!userAddress) {
      setLoading(false);
      return;
    }
    if (!id) return;

    (async () => {
      setLoading(true);
      try {
        const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);
        const chainChallenges = await contract.getChallenges();
        const index = parseInt(id, 10);

        if (
          isNaN(index) ||
          index < 0 ||
          index >= chainChallenges.length
        ) {
          console.error("Challenge ID is invalid or out of range.");
          setLoading(false);
          return;
        }

        const challenge = chainChallenges[index];
        const ipfsHash = challenge[3];
        const ipfsData = await fetch(IPFS_BASE_URL + ipfsHash).then((r) =>
          r.json()
        );

        const solved = await contract.isChallengeSolved(userAddress, index);

        setChallengeData({
          index,
          publicFlag: challenge[0],
          reward: Number(challenge[1]),
          score: Number(challenge[2]),
          name: ipfsData.name,
          description: ipfsData.description,
          category: ipfsData.category,
        });
        setIsSolved(solved);
      } catch (err) {
        console.error("Error loading challenge:", err);
      }
      setLoading(false);
    })();
  }, [provider, userAddress, id]);

  async function submitFlag() {
    if (!challengeData || !provider) return;
    setErrorMsg("");
    try {
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);
      const messageHash=await contract.getMessageHash(userAddress,challengeData.index);
      console.log("MESSAGE HASH",messageHash)
      const signature=web3.eth.accounts.sign(messageHash, userFlag).signature;

  //     const flagSigner = new ethers.Wallet(userFlag, provider);
  //     const fromHexString = (hexString:string) =>
  // Uint8Array.from(hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));
  //     const signature=await flagSigner.signMessage(fromHexString(messageHash));
      // const signature=ethers.Signature.from(signedMessage).serialized;
      console.log("SIGNATURE",signature);

      const tx = await contract.submitFlag(challengeData.index,signature);
      await tx.wait();
      setIsSolved(true);
      notify({
        title: "Challenge Solved!",
        description: "Your flag submission was successful!",
        type: "success",
      });
    } catch (err: any) {
      notify({
        title: "Submission Failed",
        type: "error",
      });
      console.error("Submit flag error:", err);
      setErrorMsg(`Incorrect or failed: ${err.message}`);
    }
  }

  if (loading) {
    return <p className="mt-16 text-center">Loading challenge details...</p>;
  }

  if (!userAddress) {
    return (
      <div className="mt-16 text-center">
        <p>Please connect your wallet first.</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate("/")}>
          Back Home
        </Button>
      </div>
    );
  }

  if (!challengeData) {
    return (
      <div className="mt-16 text-center">
        <p>Challenge not found!</p>
        <Link to="/challenges" className="underline text-blue-600 block mt-4">
          Go back to challenges
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-16 px-4 max-w-xl mx-auto">
      <Card size="3" variant="surface" className="p-6 shadow space-y-4">
        <h2 className="text-xl font-semibold">
          Challenge #{challengeData.index}: {challengeData.name}
        </h2>
        <p className="text-sm">{challengeData.description}</p>
        <p className="text-xs text-muted-foreground">
          Category: {challengeData.category}
        </p>
        <p className="text-xs">
          Reward: {challengeData.reward} wei | Score: {challengeData.score}
        </p>

        {isSolved ? (
          <p className="text-sm text-green-600 font-semibold">You solved it!</p>
        ) : (
          <div className="space-y-2">
            <textarea
              placeholder="Enter flag..."
              className="border w-full p-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              value={userFlag}
              onChange={(e) => setUserFlag(e.target.value)}
            />
            <Button variant="outline" onClick={submitFlag}>
              Submit Flag
            </Button>
            {errorMsg && (
              <p className="text-red-600 text-sm font-medium">{errorMsg}</p>
            )}
          </div>
        )}
      </Card>
      <div className="text-center mt-8">
        <Link
          to="/challenges"
          className="underline text-blue-600 hover:text-blue-400"
        >
          Back to Challenges
        </Link>
      </div>
    </div>
  );
}
