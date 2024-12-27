import React from "react";
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";
import { useUser } from "../components/context/UserContext";

export default function Login() {
  const { setUserAddress } = useUser();
  const navigate = useNavigate();

  async function connectMetaMask() {
    if (!(window as any).ethereum) {
      alert("MetaMask not installed.");
      return;
    }
    const provider = new ethers.BrowserProvider((window as any).ethereum);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    setUserAddress(address);
    localStorage.setItem("userAddress", address);
    navigate("/challenges");
  }

  return (
    <div className="mt-20 flex justify-center">
      <div className="border p-4 rounded">
        <h1 className="text-xl mb-2">Sign in</h1>
        <button
          onClick={connectMetaMask}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Connect with MetaMask
        </button>
      </div>
    </div>
  );
}
