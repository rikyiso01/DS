// src/components/ui/ProfileButton.tsx
import React from "react";
import { LogOut } from "lucide-react";
import { Button } from "@radix-ui/themes"; // direct from Radix Themes
import { useMetamask } from "../context/MetamaskContext";

export default function ProfileButton() {
    const { userAddress, setUserAddress } = useMetamask();
    if (!userAddress) return null;
  
    function handleSignOut() {
      setUserAddress("");
      localStorage.removeItem("userAddress");
    }
  
    return (
      <Button
        variant="soft"
        className="flex items-center gap-1 px-3 py-1 hover:brightness-110 transition"
        onClick={handleSignOut}
      >
        <LogOut className="w-4 h-4" />
        Sign out
      </Button>
    );
  }
