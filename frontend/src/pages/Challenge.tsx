import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS } from "@/constants";
import abi from "@/abi.json";
import Loading from "./Loading";
import InvisibleDiv from "@/components/ui/InvisibleDiv";
import SubmissionForm from "@/components/ui/SubmissionForm";
import { Flex, Text, Button } from "@radix-ui/themes";

export default function Challenge() {
  const { id } = useParams();
  const [challenge, setChallenge] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  async function getChallengeByID(challengeId: string) {
    const provider = new ethers.JsonRpcProvider(import.meta.env.VITE_INFURA_RPC);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);
    const challenges = await contract.getChallenges();
    const pinataBase = "https://some-pinata-url/ipfs/";

    const data = await Promise.all(
      challenges.map(async (c: any[]) => {
        if (c[0].toString() === challengeId) {
          const cid = pinataBase + c[3];
          const res = await (await fetch(cid)).json();
          return {
            key: Number(c[0]),
            reward: Number(c[2]),
            name: res.name,
            description: res.description,
            category: res.category,
            problem: res.problem,
          };
        }
      })
    );

    return data.filter(Boolean)[0];
  }

  useEffect(() => {
    (async () => {
      setLoading(true);
      if (id) {
        const c = await getChallengeByID(id);
        setChallenge(c);
      }
      setLoading(false);
    })();
  }, [id]);

  if (loading) return <Loading />;
  if (!challenge) return <Text>Challenge not found.</Text>;

  let content;
  switch (challenge.category) {
    case "Web":
      content = (
        <InvisibleDiv
          challengeKey={challenge.key}
          name={challenge.name}
          problem={challenge.problem}
          apiUrl={import.meta.env.VITE_API_URL}
        />
      );
      break;
    case "SQL Injection":
    case "Maths":
    case "Coding":
      content = (
        <SubmissionForm
          challengeKey={challenge.key}
          name={challenge.name}
          problem={challenge.problem}
          apiUrl={import.meta.env.VITE_API_URL}
        />
      );
      break;
    default:
      content = <Text>Coming Soon...</Text>;
  }

  return (
    <Flex direction="column" gap="2" className="items-center">
      <Text size="6" color="blue" weight="bold">
        {challenge.key}
      </Text>
      <Text size="5">{challenge.description}</Text>
      {content}

      <Link to="/challenges" className="mt-6">
        <Button variant="solid" color="blue">
          Go back to challenges
        </Button>
      </Link>
    </Flex>
  );
}
