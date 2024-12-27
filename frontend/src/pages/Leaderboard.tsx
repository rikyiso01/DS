import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useMetamask } from "../context/MetamaskContext";
import { CONTRACT_ADDRESS } from "../constants";
import abi from "../assets/abi.json";

export default function Leaderboard() {
  const { provider, userAddress } = useMetamask();
  const [players, setPlayers] = useState<{ address: string; score: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userAddress) {
      setLoading(false);
      return;
    }

    (async () => {
      setLoading(true);
      try {
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
  }, [provider, userAddress]);

  if (loading) return <p className="mt-16 text-center">Loading leaderboard...</p>;

  if (!userAddress) {
    return (
      <div className="mt-16 text-center">
        <p className="text-gray-600 mb-4">
          Please connect your wallet to see the leaderboard.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-16 px-4">
      <h1 className="text-2xl text-center mb-8 text-sky-500 font-bold">
        Leaderboard
      </h1>
      <table className="mx-auto border text-left text-sm">
        <thead>
          <tr className="bg-gray-100">
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
