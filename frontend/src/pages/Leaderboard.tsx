import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS } from "@/constants";
import abi from "@/abi.json";
import Loading from "./Loading";
import { Flex, Text } from "@radix-ui/themes";

type Player = { address: string; score: number };

export default function Leaderboard() {
  const [loading, setLoading] = useState(true);
  const [leaderboard, setLeaderboard] = useState<Player[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const provider = new ethers.JsonRpcProvider(import.meta.env.VITE_INFURA_RPC);
        const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);
        const [addresses, scores] = await contract.getScores();

        let players = addresses.map((addr: string, i: number) => ({
          address: addr,
          score: parseInt(scores[i].toString()),
        }));
        // sort descending
        players.sort((a, b) => b.score - a.score);

        setLeaderboard(players);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <Loading />;

  return (
    <Flex direction="column" align="center" gap="4">
      <Text size="5" color="blue" weight="bold" className="mt-4">
        Leaderboard
      </Text>
      <table className="border-collapse border border-slate-400">
        <thead className="bg-slate-200">
          <tr>
            <th className="border border-slate-400 px-4">Pos</th>
            <th className="border border-slate-400 px-4">Player</th>
            <th className="border border-slate-400 px-4">Score</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((p, idx) => (
            <tr key={idx}>
              <td className="border border-slate-400 p-2">{idx + 1}</td>
              <td className="border border-slate-400 p-2">{p.address}</td>
              <td className="border border-slate-400 p-2 font-bold">{p.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Flex>
  );
}
