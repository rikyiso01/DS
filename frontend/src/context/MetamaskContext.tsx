import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { ethers } from "ethers";

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
  const [userAddress, setUserAddress] = useState("");
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);

  useEffect(() => {
    const storedAddress = localStorage.getItem("userAddress");
    if (storedAddress) {
      // Attempt to auto-connect if possible
      connectWallet().catch((err) => console.log("Auto-connect failed:", err));
    }
  }, []);

  async function connectWallet() {
    if (!(window as any).ethereum) {
      alert("MetaMask not found. Please install it.");
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
    } catch (error) {
      console.error("connectWallet error:", error);
    }
  }

  function disconnectWallet() {
    setUserAddress("");
    setSigner(null);
    setProvider(null);
    localStorage.removeItem("userAddress");
  }

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
