import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS } from "../constants";
import abi from "../assets/abi.json";

interface Player {
  address: string;
  score: string;
}

export default function Leaderboard() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const provider = new ethers.BrowserProvider((window as any).ethereum);
        const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);
        const [addresses, scores] = await contract.getScores();
        const data = addresses.map((addr: string, i: number) => ({
          address: addr,
          score: scores[i].toString(),
        }));
        data.sort((a, b) => Number(b.score) - Number(a.score));
        setPlayers(data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    })();
  }, []);

  if (loading) return <p>Loading leaderboard...</p>;

  return (
    <div>
      <h1 className="text-2xl text-center mb-4">Leaderboard</h1>
      <table className="mx-auto border text-left">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2 border">Pos</th>
            <th className="px-4 py-2 border">Player</th>
            <th className="px-4 py-2 border">Score</th>
          </tr>
        </thead>
        <tbody>
          {players.map((p, i) => (
            <tr key={i}>
              <td className="px-4 py-2 border">{i + 1}</td>
              <td className="px-4 py-2 border">{p.address}</td>
              <td className="px-4 py-2 border">{p.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
