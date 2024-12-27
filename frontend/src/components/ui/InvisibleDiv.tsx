import React, { useState } from "react";
import { Button, Card, CardHeader, CardTitle, CardContent } from "@radix-ui/themes";
import { getChallengeFlag } from "@/api/userActions";

interface InvisibleDivProps {
  challengeKey: number;
  name: string;
  problem: string;
  apiUrl: string;
}

export default function InvisibleDiv({ challengeKey, name, problem, apiUrl }: InvisibleDivProps) {
  const [flag, setFlag] = useState<string | null>(null);

  async function handleClick() {
    const res = await getChallengeFlag(challengeKey, apiUrl);
    setFlag(res);
  }

  return (
    <div className="flex flex-col items-center mt-4">
      <Card className="w-full max-w-[500px]">
        <CardHeader>
          <CardTitle>{name}</CardTitle>
        </CardHeader>
        <CardContent>{problem}</CardContent>
      </Card>
      <Button variant="outline" color="blue" onClick={handleClick} className="mt-4">
        Obtain The Flag
      </Button>
      {flag && <p className="mt-2">{flag}</p>}
    </div>
  );
}
