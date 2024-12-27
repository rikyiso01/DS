// src/components/ui/ProfileButton.tsx
import React from "react";
import { LogOut } from "lucide-react";
import { Button } from "@radix-ui/themes"; // direct from Radix Themes
import { useUser } from "../context/UserContext";

export default function ProfileButton() {
  const { userAddress, setUserAddress } = useUser();
  if (!userAddress) return null;

  function handleSignOut() {
    setUserAddress("");
    localStorage.removeItem("userAddress");
  }

  return (
    <Button variant="soft" onClick={handleSignOut}>
      <LogOut className="w-4 h-4 mr-1" />
      Sign out
    </Button>
  );
}
