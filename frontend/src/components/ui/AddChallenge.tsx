import React, { useState } from "react";
import { Dialog, Button } from "@radix-ui/themes";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS } from "../../lib/constants";
import abi from "../../assets/abi.json";

export default function AddChallenge() {
  const [name, setName] = useState("");
  const [flag, setFlag] = useState("");
  const [reward, setReward] = useState("");

  async function handleAddChallenge() {
    try {
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);

      const encodedFlag = ethers.keccak256(ethers.toUtf8Bytes(flag));
      const tx = await contract.addChallenge(encodedFlag, +reward, "dummyCID");
      await tx.wait();

      alert("Challenge added!");
      // Reset fields if you want
      setName("");
      setFlag("");
      setReward("");
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button
          variant="classic"
          className="fixed bottom-7 right-7 w-16 h-16 rounded-full hover:bg-primary/90 shadow-md transition"
        >
          + 
        </Button>
      </Dialog.Trigger>

      <Dialog.Content className="p-6 bg-card border shadow-lg rounded space-y-4 max-w-sm">
        <Dialog.Title className="text-lg font-semibold">
          Add Challenge
        </Dialog.Title>
        <Dialog.Description className="text-sm text-muted-foreground">
          Fill out challenge info
        </Dialog.Description>

        <label className="block">
          <span className="text-sm">Name</span>
          <input
            className="w-full border-b focus:outline-none focus:ring-2 focus:ring-ring transition py-1 px-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label className="block">
          <span className="text-sm">Flag</span>
          <input
            className="w-full border-b focus:outline-none focus:ring-2 focus:ring-ring transition py-1 px-2"
            value={flag}
            onChange={(e) => setFlag(e.target.value)}
          />
        </label>
        <label className="block">
          <span className="text-sm">Reward</span>
          <input
            className="w-full border-b focus:outline-none focus:ring-2 focus:ring-ring transition py-1 px-2"
            value={reward}
            onChange={(e) => setReward(e.target.value)}
          />
        </label>

        <div className="flex justify-end gap-2 pt-2">
          <Button onClick={handleAddChallenge} variant="outline">
            Submit
          </Button>
          <Dialog.Close>
            <Button variant="ghost">Close</Button>
          </Dialog.Close>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
}