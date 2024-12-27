import React, { useState } from "react";
import { Card, Button } from "@radix-ui/themes";

interface SubmissionFormProps {
  challengeKey: number;
  name: string;
  problem: string;
  apiUrl: string;
}

export default function SubmissionForm({
  challengeKey,
  name,
  problem,
  apiUrl,
}: SubmissionFormProps) {
  const segments = problem.split("...");
  const [inputs, setInputs] = useState(() => Array(segments.length - 1).fill(""));

  const [resultMessage, setResultMessage] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Example logic
    const userSolution = inputs.join(" ");
    const correctSolution = "PretendSolution";
    if (userSolution === correctSolution) {
      setResultMessage("Correct solution! Flag{abc123}");
    } else {
      setResultMessage("Incorrect solution!");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card
        size="3"
        variant="surface"
        className="max-w-xl mx-auto mt-8 shadow-lg p-6 space-y-4"
      >
        {/* Header */}
        <div>
          <h2 className="text-xl font-semibold">{name}</h2>
          <p className="text-sm text-muted-foreground">
            Challenge Key: {challengeKey}
          </p>
        </div>

        {/* Body: problem with fill-in segments */}
        <div className="space-y-2">
          {segments.map((seg, i) => (
            <div key={i}>
              <p className="inline">{seg}</p>
              {i < segments.length - 1 && (
                <input
                  type="text"
                  className="border-b border-border bg-transparent px-2 py-1 focus:outline-none focus:ring-2 focus:ring-ring transition"
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

        {/* Footer */}
        <div className="flex justify-end">
          <Button type="submit" variant="outline">
            Submit
          </Button>
        </div>
      </Card>

      {resultMessage && (
        <p className="mt-4 text-center text-sm font-medium">
          {resultMessage}
        </p>
      )}
    </form>
  );
}
