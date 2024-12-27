import React, { useState } from "react";
import { useToast } from "./useToast";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS } from "@/constants";
import abi from "@/abi.json";
import { Link } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Flex,
  Button,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogClose,
  DialogTitle,
  DialogDescription,
  TextField
} from "@radix-ui/themes";

interface ChallengeProps {
  challenge: any;
  userAddress: string;
}

export default function ChallengeCard({ challenge, userAddress }: ChallengeProps) {
  const { toast } = useToast();
  const [flag, setFlag] = useState("");
  const [isSolved, setIsSolved] = useState(false);

  const { key, reward, name, description } = challenge;

  async function submitChallenge(chKey: number, userFlag: string) {
    try {
      if (!(window as any).ethereum) {
        toast({ title: "MetaMask not installed" });
        return;
      }
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();
      const signedContract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);

      // Listen for event
      signedContract.on("ChallengeSubmitted", (value: string) => {
        let msg = value;
        if (value.includes("Correct answer")) {
          msg += ` You earned ${reward} wei!`;
          setIsSolved(true);
        }
        toast({ title: "Challenge submitted", description: msg });
      });

      const encodedFlag = ethers.keccak256(ethers.toUtf8Bytes(userFlag));
      const tx = await signedContract.submitFlag(chKey, encodedFlag, {
        value: ethers.parseEther("0.000000000000000001"),
      });
      await tx.wait();
    } catch (error: any) {
      toast({ title: "Error", description: error.message });
    }
  }

  return (
    <Card
      variant="surface"
      className={`relative w-[300px] ${isSolved ? "bg-green-50" : ""}`}
    >
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {isSolved ? (
          <p>Earned {reward} wei</p>
        ) : (
          <p>Correct answer earns {reward} wei</p>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        {!isSolved && (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" color="blue">
                Submit Flag
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle>Submit flag</DialogTitle>
              <DialogDescription>
                Submit the correct flag for this challenge.
              </DialogDescription>
              <Flex direction="column" gap="3" className="mt-3">
                <TextField
                  type="text"
                  placeholder="Your flag here"
                  value={flag}
                  onChange={(e) => setFlag(e.target.value)}
                />
                <Button onClick={() => submitChallenge(key, flag)}>Submit</Button>
              </Flex>
              <DialogClose asChild>
                <Button variant="ghost" className="absolute top-2 right-2">
                  X
                </Button>
              </DialogClose>
            </DialogContent>
          </Dialog>
        )}
        <Link to={`/challenge/${key}`}>
          <Button variant="soft" color="gray">Start</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
