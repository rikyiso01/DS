// src/components/ui/InvisibleDiv.tsx
import React, { useState } from "react";
import { Card, Button } from "@radix-ui/themes";
import { ethers } from "ethers";
import { useMetamask } from "../context/MetamaskContext";
import { CONTRACT_ADDRESS } from "../../lib/constants";
import abi from "../../assets/abi.json";

interface InvisibleDivProps {
  challengeKey: number;
  name: string;
  problem: string;
}

export default function InvisibleDiv({
  challengeKey,
  name,
  problem,
}: InvisibleDivProps) {
  const { provider } = useMetamask();
  const [flag, setFlag] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  async function handleClick() {
    // Example logic to "submit" the challenge with a dummy signature
    if (!provider) {
      setMessage("Not connected to Metamask");
      return;
    }
    try {
      // We'll just show a dummy approach
      // In reality, you'd gather a signature from the user or ask them to sign
      const dummySignature = "0x1234...";
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);

      const tx = await contract.submitFlag(challengeKey, dummySignature);
      await tx.wait();

      setMessage("Challenge submitted successfully! You should get your reward now.");
    } catch (err: any) {
      console.error("Error submit flag:", err);
      setMessage(`Error: ${err.message}`);
    }
  }

  return (
    <Card className="max-w-xl mx-auto mt-4 shadow p-6 space-y-4" size="2" variant="surface">
      <div>
        <h2 className="text-xl font-semibold">{name}</h2>
        <p className="text-sm text-muted-foreground">Problem: {problem}</p>
      </div>
      <div>
        <p>This is a “InvisibleDiv” for category=Web.</p>
        <Button variant="outline" onClick={handleClick} className="mt-2">
          Submit a dummy signature
        </Button>
        {message && <p className="mt-2 text-sm text-gray-700">{message}</p>}
        {flag && (
          <p className="mt-2 text-green-600 font-semibold">{flag}</p>
        )}
      </div>
    </Card>
  );
}
