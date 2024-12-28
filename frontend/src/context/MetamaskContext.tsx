import React, { createContext, ReactNode, useContext, useState, useEffect } from "react";
import { ethers } from "ethers";
import { useNotification } from "./NotificationContext";

interface MetamaskContextType {
  userAddress: string;
  provider: ethers.BrowserProvider | null;
  signer: ethers.Signer | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

const MetamaskContext = createContext<MetamaskContextType>({
  userAddress: "",
  provider: null,
  signer: null,
  connectWallet: async () => {},
  disconnectWallet: () => {},
});

export function MetamaskContextProvider({ children }: { children: ReactNode }) {
  const { notify } = useNotification();

  const [userAddress, setUserAddress] = useState("");
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);

  async function connectWallet() {
    if (!(window as any).ethereum) {
      notify({
        title: "MetaMask not found",
        description: "Please install MetaMask to connect your wallet.",
        type: "error",
      });
      return;
    }

    try {
      const _provider = new ethers.BrowserProvider((window as any).ethereum);
      const _signer = await _provider.getSigner();
      const _userAddress = await _signer.getAddress();

      setProvider(_provider);
      setSigner(_signer);
      setUserAddress(_userAddress);
      localStorage.setItem("userAddress", _userAddress);

      notify({
        title: "Wallet Connected",
        description: `Connected as ${_userAddress.slice(0, 6)}...${_userAddress.slice(-4)}`,
        type: "success",
      });

      // Listen for account changes
      (window as any).ethereum.on("accountsChanged", handleAccountsChanged);
    } catch (error) {
      notify({
        title: "Connection Error",
        description: String(error),
        type: "error",
      });
    }
  }

  function disconnectWallet() {
    setUserAddress("");
    setSigner(null);
    setProvider(null);
    localStorage.removeItem("userAddress");

    notify({
      title: "Wallet Disconnected",
      type: "info",
    });

    // Remove the event listener when disconnected
    if ((window as any).ethereum?.removeListener) {
      (window as any).ethereum.removeListener("accountsChanged", handleAccountsChanged);
    }
  }

  function handleAccountsChanged(accounts: string[]) {
    if (accounts.length === 0) {
      // User disconnected their account from MetaMask
      disconnectWallet();
      notify({
        title: "Account Disconnected",
        description: "Your wallet was disconnected. Please reconnect.",
        type: "info",
      });
    } else if (accounts[0] !== userAddress) {
      // User switched to a different account
      disconnectWallet();
      notify({
        title: "Account Changed",
        description: "You switched accounts. Please reconnect.",
        type: "info",
      });
    }
  }

  useEffect(() => {
    const storedAddress = localStorage.getItem("userAddress");
    if (storedAddress) {
      connectWallet().catch((err) =>
        console.log("Auto-connect failed:", err)
      );
    }

    return () => {
      // Cleanup the event listener when the component unmounts
      if ((window as any).ethereum?.removeListener) {
        (window as any).ethereum.removeListener("accountsChanged", handleAccountsChanged);
      }
    };
  }, []);

  return (
    <MetamaskContext.Provider
      value={{
        userAddress,
        provider,
        signer,
        connectWallet,
        disconnectWallet,
      }}
    >
      {children}
    </MetamaskContext.Provider>
  );
}

export function useMetamask() {
  return useContext(MetamaskContext);
}
