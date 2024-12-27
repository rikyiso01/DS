import React, { createContext, useContext, useState, useEffect } from "react";
import { ethers } from "ethers";

interface MetamaskContextProps {
  userAddress: string;
  setUserAddress: (address: string) => void;
  provider: ethers.BrowserProvider | null;
  signer: ethers.Signer | null;
  setMetamask: (
    provider: ethers.BrowserProvider,
    signer: ethers.Signer,
    address: string
  ) => void;
}

const MetamaskContext = createContext<MetamaskContextProps>({
  userAddress: "",
  setUserAddress: () => {},
  provider: null,
  signer: null,
  setMetamask: () => {},
});

export function MetamaskContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [userAddress, setUserAddress] = useState(() => {
    return localStorage.getItem("userAddress") || "";
  });
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(() => {
    return new ethers.BrowserProvider((window as any).ethereum);
  });
  const [signer, setSigner] = useState<ethers.Signer | null>(null);

  function setMetamask(
    provider: ethers.BrowserProvider,
    signer: ethers.Signer,
    userAddress: string
  ) {
    setProvider(provider);
    setSigner(signer);
    setUserAddress(userAddress);

    localStorage.setItem("userAddress", userAddress);
  }

  useEffect(() => {
    // Try to load from localStorage if you want
    const stored = localStorage.getItem("userAddress");
    if (!stored) return;

    (async () => {
      // If we want to watch for metamask account changes
      if ((window as any).ethereum) {
        try {
          const autoProvider = new ethers.BrowserProvider((window as any).ethereum);
          const autoSigner = await autoProvider.getSigner();
          const autoAddress = await autoSigner.getAddress();

          if (autoAddress.toLowerCase() === stored.toLowerCase()) {
            setProvider(autoProvider);
            setSigner(autoSigner);
            setUserAddress(autoAddress);
          } else {
            console.log("Stored address does not match MetaMask address.");
            localStorage.removeItem("userAddress");
          }
        } catch (err) {
          console.error(err);
        }
      }
    })();
  }, []);

  return (
    <MetamaskContext.Provider value={{ userAddress, provider, signer, setMetamask, setUserAddress }}>
      {children}
    </MetamaskContext.Provider>
  );
}

export function useMetamask() {
  return useContext(MetamaskContext);
}
