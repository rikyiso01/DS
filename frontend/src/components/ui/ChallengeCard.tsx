import React, { useState } from "react";
import { Dialog, Button, Card } from "@radix-ui/themes";
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
    <Card
      size="3"
      variant="surface"
      className={`mt-5 shadow-sm p-6 space-y-2 ${
        isSolved ? "bg-green-50" : "bg-white"
      }`}
    >
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold">{name}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      {/* Body */}
      <div>
        {isSolved ? (
          <p className="text-green-700 font-medium">
            Solved! You earned {reward} wei
          </p>
        ) : (
          <p className="text-sm">Reward: {reward} wei</p>
        )}
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center pt-2">
        {!isSolved && (
          <Dialog.Root>
            <Dialog.Trigger>
              <Button variant="soft" className="mr-2">
                Submit Flag
              </Button>
            </Dialog.Trigger>

            <Dialog.Content className="p-6 bg-card border shadow-lg rounded space-y-4">
              <Dialog.Title className="text-lg font-semibold">
                Submit Flag
              </Dialog.Title>
              <Dialog.Description className="text-sm text-muted-foreground">
                Enter your flag for this challenge below:
              </Dialog.Description>
              <input
                className="w-full border-b focus:outline-none focus:ring-2 focus:ring-ring transition py-1 px-2"
                value={flag}
                onChange={(e) => setFlag(e.target.value)}
              />
              <div className="flex justify-end gap-2 mt-4">
                <Button onClick={handleSubmitFlag} variant="outline">
                  Submit
                </Button>
                <Dialog.Close>
                  <Button variant="ghost">Close</Button>
                </Dialog.Close>
              </div>
            </Dialog.Content>
          </Dialog.Root>
        )}

        <a
          href={`/challenge/${key}`}
          className="underline text-blue-600 hover:text-blue-400 transition"
        >
          Go
        </a>
      </div>
    </Card>
  );
}