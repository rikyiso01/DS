import React, { useState } from "react";
import { Dialog, Button } from "@radix-ui/themes";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS } from "../../lib/constants";
import abi from "../../assets/abi.json";

interface Challenge {
  key: number;
  reward: number;
  name: string;
  description: string;
}

interface ChallengeCardProps {
  challenge: Challenge;
  userAddress: string;
  isSolved?: boolean;
}

export default function ChallengeCard({ challenge, userAddress, isSolved }: ChallengeCardProps) {
  const { key, reward, name, description } = challenge;
  const [flag, setFlag] = useState("");

  async function handleSubmitFlag() {
    try {
      // Example web3 call
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);

      // e.g. contract.submitFlag(key, encodedFlag, { value: something })
      alert(`Submitting flag "${flag}" for challenge #${key} with reward ${reward}`);
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  }

  return (
    <div
      className={`border p-4 rounded mt-4 ${
        isSolved ? "bg-green-50" : "bg-white"
      }`}
    >
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold">{name}</h2>
        <p className="text-sm text-gray-500">{description}</p>
      </div>

      {/* Body */}
      <div className="my-2">
        {isSolved ? (
          <p>Congrats! You earned {reward} wei</p>
        ) : (
          <p>Reward: {reward} wei</p>
        )}
      </div>

      {/* Footer: Submit Flag Dialog & "Go" link */}
      <div className="flex justify-between items-center">
        {!isSolved && (
          <Dialog.Root>
            <Dialog.Trigger>
              <Button variant="soft">Submit Flag</Button>
            </Dialog.Trigger>
            <Dialog.Content>
              <Dialog.Title>Submit Flag</Dialog.Title>
              <Dialog.Description>Enter your flag below</Dialog.Description>
              <input
                className="border w-full p-1 my-2"
                value={flag}
                onChange={(e) => setFlag(e.target.value)}
              />
              <div className="flex gap-2 mt-4 justify-end">
                <Button onClick={handleSubmitFlag}>Submit</Button>
                <Dialog.Close>
                  <Button variant="ghost">Close</Button>
                </Dialog.Close>
              </div>
            </Dialog.Content>
          </Dialog.Root>
        )}

        <a
          href={`/challenge/${key}`}
          className="underline text-blue-600"
        >
          Go
        </a>
      </div>
    </div>
  );
}
