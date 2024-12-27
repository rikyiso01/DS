import React from "react";
import { Link } from "react-router-dom";
import { useUser } from "../components/context/UserContext";
import coding from "../assets/coding.png";
import maths from "../assets/maths.png";
import security from "../assets/security.png";
import { useEffect, useState } from "react";

const SLIDE_DURATION = 4000;

type Slide = {
  text: string;
  image: string;
};

export default function Home() {
  const { userAddress } = useUser();
  const slides: Slide[] = [
    {
      text: "SmartChallenge is an innovative platform designed to test and enhance your skills in coding, mathematics, and security. Our challenges are designed to push your limits and inspire creativity.",
      image: coding,
    },
    {
      text: "Upon successful completion of each challenge, you'll receive a flag. Submit this flag along with your player's address to our smart contract, and watch as your score updates on our live competition scoreboard.",
      image: maths,
    },
    {
      text: "New challenges will be added regularly, each with their own flags. You'll have to figure them out on your own! Good luck, and may the best mind win!",
      image: security,
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-rotate slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, SLIDE_DURATION);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="mt-20 px-4 text-center">
      {/* Page heading */}
      <h1 className="text-sky-500 text-2xl font-bold mb-6">
        Welcome to SmartChallenge@DIBRIS!
      </h1>

      {/* Slides container: fixed height so nothing overlaps */}
      <div className="relative mx-auto max-w-xl h-80 overflow-hidden rounded shadow-lg">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`
              absolute inset-0 flex flex-col items-center justify-center p-4
              ${
                index === currentIndex
                  ? // Animate in this slide with tailwindcss-animate
                    "block animate-in fade-in duration-500"
                  : "hidden"
              }
            `}
          >
            <img
              src={slide.image}
              alt="Slide"
              className="mx-auto mb-4 max-h-40 object-contain"
            />
            <p className="text-base text-foreground px-2">
              {slide.text}
            </p>
          </div>
        ))}
      </div>

      {/* Connect Wallet or show user address */}
      <div className="mt-8">
        {!userAddress ? (
          <Link
            to="/login"
            className="inline-block bg-secondary text-secondary-foreground px-4 py-2 rounded hover:bg-secondary/90 transition font-medium"
          >
            Connect Wallet to Start!
          </Link>
        ) : (
          <p className="text-sm text-muted-foreground font-medium">
            You are user:{" "}
            <span className="font-semibold text-foreground">
              {userAddress}
            </span>
          </p>
        )}
      </div>
    </div>
  );
}