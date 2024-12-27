// src/components/ui/SubmissionForm.tsx
import React, { useState } from "react";
import { Card, Button } from "@radix-ui/themes";
import { ethers } from "ethers";
import { useMetamask } from "../context/MetamaskContext";
import { CONTRACT_ADDRESS } from "../../lib/constants";
import abi from "../../assets/abi.json";

interface SubmissionFormProps {
  challengeKey: number;
  name: string;
  problem: string;
}

export default function SubmissionForm({
  challengeKey,
  name,
  problem,
}: SubmissionFormProps) {
  const { provider } = useMetamask();
  const segments = problem.split("...");
  const [inputs, setInputs] = useState(() => Array(segments.length - 1).fill(""));
  const [resultMessage, setResultMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // The user typed something into these input fields
    // Potentially you'd transform them into a signature or do some logic
    if (!provider) {
      setResultMessage("Not connected to Metamask");
      return;
    }
    try {
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);

      // Combine user input into a "signature" for demonstration
      const userSignature = inputs.join("_");
      const tx = await contract.submitFlag(challengeKey, userSignature); // In reality, must be bytes
      await tx.wait();

      setResultMessage("Flag submitted successfully! Challenge solved!");
    } catch (err: any) {
      console.error("Error submitting solution:", err);
      setResultMessage(`Error: ${err.message}`);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card className="max-w-xl mx-auto mt-4 shadow p-6 space-y-4" size="2" variant="surface">
        <div>
          <h2 className="text-xl font-semibold">{name}</h2>
          <p className="text-sm text-muted-foreground">Challenge Key: {challengeKey}</p>
        </div>
        <div>
          {segments.map((seg, i) => (
            <div key={i} className="mb-2">
              <p className="inline mr-2">{seg}</p>
              {i < segments.length - 1 && (
                <input
                  type="text"
                  className="border-b px-1 focus:outline-none focus:ring-2 focus:ring-ring transition"
                  value={inputs[i]}
                  onChange={(e) => {
                    const next = [...inputs];
                    next[i] = e.target.value;
                    setInputs(next);
                  }}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-2">
          <Button type="submit" variant="outline">
            Submit
          </Button>
        </div>
      </Card>

      {resultMessage && (
        <p className="mt-4 text-center text-sm font-medium text-gray-700">
          {resultMessage}
        </p>
      )}
    </form>
  );
}
