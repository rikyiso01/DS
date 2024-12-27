// src/components/ui/Nav.tsx
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import { useUser } from "../context/UserContext";
import ProfileButton from "./ProfileButton";
import scLogo from "../../assets/sc.png";

export default function Nav() {
  const { userAddress } = useUser();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { name: "Home", href: "/" },
    { name: "Challenges", href: "/challenges" },
    { name: "Leaderboard", href: "/leaderboard" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow z-10 p-4 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-2">
        <img src={scLogo} alt="SmartChallenge" width={50} />
        <h2 className="text-xl font-bold">SmartChallenge</h2>
      </Link>
      <button
        className="md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Menu />
      </button>
      <ul
        className={`md:flex gap-4 absolute md:static top-14 left-0 w-full bg-white p-4 md:p-0 ${
          isOpen ? "block" : "hidden"
        }`}
      >
        {links.map((link, i) => (
          <li key={i}>
            <Link
              to={link.href}
              className={
                location.pathname === link.href ? "font-bold" : "hover:underline"
              }
            >
              {link.name}
            </Link>
          </li>
        ))}
        {userAddress && (
          <li>
            <Link to={`/users/${userAddress}`}>Profile</Link>
          </li>
        )}
      </ul>
      {userAddress && <div className="hidden md:block"><ProfileButton /></div>}
    </nav>
  );
}
