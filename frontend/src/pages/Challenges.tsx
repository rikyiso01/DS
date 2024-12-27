import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import abi from "@/abi.json";
import { CONTRACT_ADDRESS } from "@/constants";
import { useUser } from "@/components/context/UserContext";
import Loading from "./Loading";
import ChallengeCard from "@/components/ui/ChallengeCard";
import AddChallenge from "@/components/ui/AddChallenge";
import { Flex, Text } from "@radix-ui/themes";

export default function Challenges() {
  const { userAddress } = useUser();
  const navigate = useNavigate();
  const [challenges, setChallenges] = useState<any[]>([]);
  const [ownerAddress, setOwnerAddress] = useState("");
  const [loading, setLoading] = useState(true);

  async function fetchChallenges() {
    try {
      setLoading(true);

      // Use your own RPC endpoint or Infura
      const provider = new ethers.JsonRpcProvider(import.meta.env.VITE_INFURA_RPC);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);

      const contractChallenges = await contract.getChallenges();

      // Pinata base
      const pinataBase = "https://some-pinata-url/ipfs/";

      const arr = await Promise.all(
        contractChallenges.map(async (c: any[]) => {
          const cid = pinataBase + c[3];
          const res = await (await fetch(cid)).json();
          return {
            key: Number(c[0]),
            reward: Number(c[2]),
            name: res.name,
            description: res.description,
            category: res.category,
          };
        })
      );
      setChallenges(arr);

      const _owner = await contract.getOwner();
      setOwnerAddress(_owner);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!userAddress) {
      navigate("/login");
      return;
    }
    fetchChallenges();
  }, [userAddress]);

  if (loading) return <Loading />;

  return (
    <Flex direction="column" gap="4">
      <Text size="5" color="blue" weight="bold" className="mx-auto mt-4">
        Challenges
      </Text>
      <Flex wrap="wrap" gap="4" justify="center">
        {challenges.map(ch => (
          <ChallengeCard key={ch.key} challenge={ch} userAddress={userAddress!} />
        ))}
      </Flex>
      {/* If user is the contract owner, show AddChallenge */}
      {userAddress?.toLowerCase() === ownerAddress.toLowerCase() && <AddChallenge />}
    </Flex>
  );
}
