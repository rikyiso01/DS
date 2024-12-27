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
    // e.g. a web3 or an API call
    setFlag("ExampleFlag{12345}");
  }

  return (
    <Card
      size="3"
      variant="surface"
      className="max-w-xl mx-auto mt-8 shadow-lg p-6 space-y-4"
    >
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold tracking-tight">{name}</h2>
        <p className="text-sm text-muted-foreground">
          Problem: {problem}
        </p>
      </div>

      {/* Body */}
      <div>
        <p>
          This is the “InvisibleDiv” logic for challengeKey: {challengeKey}.
        </p>
        <Button
          variant="outline"
          className="mt-2 hover:bg-secondary hover:text-secondary-foreground"
          onClick={handleClick}
        >
          Obtain The Flag
        </Button>
        {flag && (
          <p className="mt-2 text-green-600 font-semibold">{flag}</p>
        )}
      </div>
    </Card>
  );
}
