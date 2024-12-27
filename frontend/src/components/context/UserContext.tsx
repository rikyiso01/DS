import React, { createContext, useContext, useState, useEffect } from "react";

interface UserContextProps {
  userAddress: string;
  setUserAddress: (addr: string) => void;
}

const UserContext = createContext<UserContextProps>({
  userAddress: "",
  setUserAddress: () => {},
});

export function UserContextProvider({ children }: { children: React.ReactNode }) {
  const [userAddress, setUserAddress] = useState("");

  // Optionally sync with local storage
  useEffect(() => {
    const stored = localStorage.getItem("userAddress");
    if (stored) setUserAddress(stored);
  }, []);

  useEffect(() => {
    if (userAddress) localStorage.setItem("userAddress", userAddress);
    else localStorage.removeItem("userAddress");
  }, [userAddress]);

  return (
    <UserContext.Provider value={{ userAddress, setUserAddress }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
