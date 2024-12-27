import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@radix-ui/themes";
import { Menu } from "lucide-react";
import { useMetamask } from "../context/MetamaskContext";
import scLogo from "../assets/sc.png";

export default function Nav() {
  const { userAddress, connectWallet, disconnectWallet } = useMetamask();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { name: "Home", href: "/" },
    { name: "Challenges", href: "/challenges" },
    { name: "Leaderboard", href: "/leaderboard" },
  ];

  function toggleMobile() {
    setMobileOpen((prev) => !prev);
  }

  return (
    <nav className="fixed top-0 w-full z-20 bg-white shadow flex items-center justify-between px-4 py-3">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2">
        <img src={scLogo} alt="SmartChallenge" className="w-8 h-8" />
        <span className="font-bold text-xl">SmartChallenge</span>
      </Link>

      {/* Mobile toggle button */}
      <button
        className="md:hidden border rounded p-1"
        onClick={toggleMobile}
        aria-label="Toggle menu"
      >
        <Menu />
      </button>

      {/* Links + Connect/Logout */}
      <div
        className={`${
          mobileOpen ? "block" : "hidden"
        } absolute top-14 left-0 w-full bg-white md:static md:block md:w-auto`}
      >
        <ul className="md:flex md:items-center md:gap-4 p-4 md:p-0">
          {links.map((link) => (
            <li key={link.name} className="my-2 md:my-0">
              <Link
                to={link.href}
                className={`block px-2 py-1 rounded hover:bg-secondary hover:text-secondary-foreground transition ${
                  location.pathname === link.href
                    ? "font-semibold underline"
                    : ""
                }`}
                onClick={() => setMobileOpen(false)}
              >
                {link.name}
              </Link>
            </li>
          ))}
          <li className="mt-2 md:mt-0 md:ml-2">
            {userAddress ? (
              <Button variant="soft" onClick={disconnectWallet}>
                Logout
              </Button>
            ) : (
              <Button variant="solid" onClick={connectWallet}>
                Connect
              </Button>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
}
