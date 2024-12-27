import React, { createContext, useContext, useState, useEffect } from "react";

interface UserContextProps {
  userAddress: string;
  setUserAddress: React.Dispatch<React.SetStateAction<string>>;
}

const UserContext = createContext<UserContextProps>({
  userAddress: "",
  setUserAddress: () => {}
});

export function UserContextProvider({ children }: { children: React.ReactNode }) {
  const [userAddress, setUserAddress] = useState("");

  useEffect(() => {
    // Try to load from localStorage if you want
    const stored = localStorage.getItem("userAddress");
    if (stored) setUserAddress(stored);

    // If we want to watch for metamask account changes
    if ((window as any).ethereum) {
      (window as any).ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length > 0) {
          setUserAddress(accounts[0]);
          localStorage.setItem("userAddress", accounts[0]);
        } else {
          setUserAddress("");
          localStorage.removeItem("userAddress");
        }
      });
    }
  }, []);

  return (
    <UserContext.Provider value={{ userAddress, setUserAddress }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
