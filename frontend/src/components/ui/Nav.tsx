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
      <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-10 py-3 px-4 flex items-center justify-between">
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2">
          <img
            src={scLogo}
            alt="SmartChallenge"
            className="w-10 h-10 object-contain"
          />
          <h2 className="text-xl font-bold logo">SmartChallenge</h2>
        </Link>
  
        {/* MOBILE BUTTON */}
        <button
          className="md:hidden border rounded p-1"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Menu />
        </button>
  
        {/* LINKS */}
        <ul
          className={`${
            isOpen ? "block" : "hidden"
          } absolute md:static top-14 left-0 w-full md:w-auto bg-white md:bg-transparent p-4 md:p-0 md:flex gap-4 items-center transition-all`}
        >
          {links.map((link, i) => (
            <li key={i}>
              <Link
                to={link.href}
                className={`block md:inline px-2 py-1 rounded hover:bg-secondary hover:text-secondary-foreground transition ${
                  location.pathname === link.href ? "font-semibold underline" : ""
                }`}
              >
                {link.name}
              </Link>
            </li>
          ))}
          {userAddress && (
            <li>
              <Link
                to={`/users/${userAddress}`}
                className="block md:inline px-2 py-1 rounded hover:bg-secondary hover:text-secondary-foreground transition"
              >
                Profile
              </Link>
            </li>
          )}
        </ul>
  
        {/* PROFILE BUTTON (Desktop only) */}
        {userAddress && (
          <div className="hidden md:block">
            <ProfileButton />
          </div>
        )}
      </nav>
    );
  }