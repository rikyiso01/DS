import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Flex, Text } from "@radix-ui/themes";
import scLogo from "@/assets/sc.png";
import { Menu } from "lucide-react";
import { useUser } from "@/components/context/UserContext";
import ProfileButton from "./ProfileButton";

interface NavLink {
  name: string;
  href: string;
}

export default function NavBar() {
  const { userAddress } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const links: NavLink[] = [
    { name: "Home", href: "/" },
    { name: "Challenges", href: "/challenges" },
    { name: "Leaderboard", href: "/leaderboard" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-10 bg-white shadow-md h-16 flex items-center px-4">
      <Flex align="center" justify="between" className="w-full">
        {/* Logo & Title */}
        <Flex align="center" gap="3">
          <Link to="/">
            <img src={scLogo} alt="SmartChallenge" className="h-10 w-10" />
          </Link>
          <Text asChild size="5" weight="bold" className="hidden md:block">
            <span>SmartChallenge</span>
          </Text>
        </Flex>

        {/* Mobile Menu */}
        <button
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Menu />
        </button>

        {/* Desktop Menu */}
        <Flex
          gap="4"
          className={`items-center ${isOpen ? "block" : "hidden"} md:flex`}
        >
          {links.map((lnk) => (
            <Link
              key={lnk.href}
              to={lnk.href}
              className={`${
                location.pathname === lnk.href
                  ? "text-blue-600 font-semibold"
                  : "text-gray-800 hover:text-blue-600"
              }`}
            >
              {lnk.name}
            </Link>
          ))}
          {userAddress && <ProfileButton />}
        </Flex>
      </Flex>
    </nav>
  );
}
