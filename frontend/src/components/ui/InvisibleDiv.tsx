import React, { useState } from "react";
import { Card, Button } from "@radix-ui/themes";

interface InvisibleDivProps {
  challengeKey: number;
  name: string;
  problem: string;
  apiUrl: string;
}

export default function InvisibleDiv({
  challengeKey,
  name,
  problem,
  apiUrl,
}: InvisibleDivProps) {
  const [flag, setFlag] = useState<string | null>(null);

  async function handleClick() {
    // e.g. some web3 call or fetch to get the flag
    setFlag("ExampleFlag{12345}");
  }

  return (
    <Card className="max-w-xl mx-auto p-4 space-y-4 mt-8" size="2" variant="surface">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold">{name}</h2>
        <p className="text-sm text-gray-500">Problem: {problem}</p>
      </div>

      {/* Body (content) */}
      <div>
        <p>This is the “InvisibleDiv” for challengeKey: {challengeKey}</p>
        <Button variant="soft" onClick={handleClick} className="mt-2">
          Obtain The Flag
        </Button>
        {flag && <p className="mt-2 text-green-600">{flag}</p>}
      </div>
    </Card>
  );
}
