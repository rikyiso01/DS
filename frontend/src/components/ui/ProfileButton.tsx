import React, { useState, useRef, useEffect } from "react";
import { LogOut } from "lucide-react";
import { useUser } from "@/components/context/UserContext";
import { useToast } from "./useToast";
import { Button, Text } from "@radix-ui/themes";

export default function ProfileButton() {
  const { userAddress, setUserAddress } = useUser();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  function handleSignOut() {
    setUserAddress("");
    toast({
      title: "Signed out",
      description: "You have successfully disconnected your wallet",
    });
  }

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <Button variant="outline" onClick={() => setOpen(!open)}>
        <Text size="2" className="truncate max-w-[120px]">
          {userAddress}
        </Text>
      </Button>
      {open && (
        <div className="absolute right-0 mt-2 w-40 p-2 bg-white shadow-lg rounded-md z-50">
          <Button variant="soft" color="red" onClick={handleSignOut}>
            <LogOut className="mr-2" /> Sign out
          </Button>
        </div>
      )}
    </div>
  );
}
