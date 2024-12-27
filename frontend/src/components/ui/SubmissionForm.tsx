import React, { useState } from "react";
import { getChallengeSolution, checkSolutionCorrectness, getChallengeFlag } from "@/api/userActions";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, Button } from "@radix-ui/themes";

interface SubmissionFormProps {
  challengeKey: number;
  problem: string;
  name: string;
  apiUrl: string;
}

export default function SubmissionForm({ challengeKey, problem, name, apiUrl }: SubmissionFormProps) {
  const [inputValues, setInputValues] = useState<string[]>(Array(problem.split("...").length - 1).fill(""));
  const [flag, setFlag] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const solution = await getChallengeSolution(challengeKey, apiUrl);
    const isCorrect = await checkSolutionCorrectness(inputValues.join(" "), solution);
    if (isCorrect) {
      const realFlag = await getChallengeFlag(challengeKey, apiUrl);
      setFlag(realFlag);
    } else {
      setFlag("Incorrect solution!");
    }
  }

  const segments = problem.split("...");

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-[600px] mt-4">
      <Card>
        <CardHeader>
          <CardTitle>{name}</CardTitle>
        </CardHeader>
        <CardContent>
          {segments.map((seg, index) => (
            <React.Fragment key={index}>
              <p>{seg}</p>
              {index < segments.length - 1 && (
                <input
                  type="text"
                  className="border mt-1 mb-3 p-1 w-full"
                  value={inputValues[index]}
                  onChange={(e) => {
                    const newArr = [...inputValues];
                    newArr[index] = e.target.value;
                    setInputValues(newArr);
                  }}
                />
              )}
            </React.Fragment>
          ))}
        </CardContent>
        <CardFooter>
          <Button type="submit" variant="outline">Submit</Button>
        </CardFooter>
      </Card>
      {flag && <p className="mt-2 text-center">{flag}</p>}
    </form>
  );
}
