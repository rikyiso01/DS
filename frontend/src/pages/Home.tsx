import React from "react";
import { Link } from "react-router-dom";
import { useUser } from "@/components/context/UserContext";
import { Flex, Text, Button } from "@radix-ui/themes";
import coding from "@/assets/coding.png";
import maths from "@/assets/maths.png";
import security from "@/assets/security.png";

type Slide = { text: string; image: string };

const slides: Slide[] = [
  {
    text: "SmartChallenge is an innovative platform to test your coding, mathematics, and security skills.",
    image: coding,
  },
  {
    text: "Complete challenges, obtain flags, and submit them to earn points on the live leaderboard.",
    image: maths,
  },
  {
    text: "Stay sharp! We add new challenges regularly. The best minds always find a way!",
    image: security,
  },
];

export default function Home() {
  const { userAddress } = useUser();

  return (
    <Flex direction="column" gap="4" align="center" className="text-center px-4">
      <Text size="6" asChild>
        <h1 className="text-sky-600 font-bold mt-4">
          Welcome to SmartChallenge@DIBRIS!
        </h1>
      </Text>

      <Flex
        direction={{ initial: "column", md: "row" }}
        gap="4"
        justify="center"
        wrap="wrap"
        className="mt-4"
      >
        {slides.map((s, idx) => (
          <Flex
            key={idx}
            direction="column"
            gap="2"
            className="p-4 border rounded-md bg-white shadow-md w-80"
          >
            <Text>{s.text}</Text>
            <img src={s.image} alt="slide" className="h-32 mx-auto" />
          </Flex>
        ))}
      </Flex>

      {!userAddress ? (
        <Link to="/login">
          <Button variant="outline" className="mt-4">
            Connect Wallet to Start!
          </Button>
        </Link>
      ) : (
        <Button variant="outline" className="mt-4" disabled>
          Connected user: {userAddress}
        </Button>
      )}
    </Flex>
  );
}
