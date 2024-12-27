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
      {/* The button that triggers the dialog */}
      <Dialog.Trigger>
        <Button variant="soft" style={{ position: "fixed", bottom: 20, right: 20 }}>
          + Add Challenge
        </Button>
      </Dialog.Trigger>

      {/* The dialog content (overlay, panel, etc.) */}
      <Dialog.Content>
        <Dialog.Title>Add Challenge</Dialog.Title>
        <Dialog.Description>
          Fill out the new challenge info below:
        </Dialog.Description>

        <label className="block mt-2">
          Name
          <input
            className="border w-full p-1 mt-1"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>

        <label className="block mt-2">
          Flag
          <input
            className="border w-full p-1 mt-1"
            value={flag}
            onChange={(e) => setFlag(e.target.value)}
          />
        </label>

        <label className="block mt-2 mb-4">
          Reward
          <input
            className="border w-full p-1 mt-1"
            value={reward}
            onChange={(e) => setReward(e.target.value)}
          />
        </label>

        <div className="flex justify-end gap-2">
          <Button onClick={handleAddChallenge}>Submit</Button>
          <Dialog.Close>
            <Button variant="ghost">Close</Button>
          </Dialog.Close>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
}
