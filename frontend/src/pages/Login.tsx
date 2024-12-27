import React from "react";
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";
import { Flex, Text, Button, Card, CardHeader, CardContent } from "@radix-ui/themes";
import { useToast } from "@/components/ui/useToast";
import { useUser } from "@/components/context/UserContext";

export default function Login() {
  const navigate = useNavigate();
  const { userAddress, setUserAddress } = useUser();
  const { toast } = useToast();

  async function connectMetaMask() {
    try {
      if (!(window as any).ethereum) {
        toast({
          title: "MetaMask not installed",
          description: "Please install MetaMask to continue.",
        });
        return;
      }
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();
      const addr = await signer.getAddress();
      setUserAddress(addr);

      toast({
        title: "Wallet connected",
        description: addr,
      });
      navigate("/challenges");
    } catch (error: any) {
      toast({
        title: "Connection error",
        description: error.message,
      });
    }
  }

  return (
    <Flex justify="center" className="mt-20">
      <Card style={{ width: 360 }}>
        <CardHeader>
          <Text size="5" weight="bold">
            Sign in
          </Text>
          <Text size="2" color="gray">
            to continue to SmartChallenge
          </Text>
        </CardHeader>
        <CardContent>
          <Button variant="outline" onClick={connectMetaMask} className="w-full">
            <Flex align="center" gap="2" justify="center">
              <img src="/metamask-fox.svg" alt="MetaMask" width={20} />
              <Text>Continue with MetaMask</Text>
            </Flex>
          </Button>
        </CardContent>
      </Card>
    </Flex>
  );
}
