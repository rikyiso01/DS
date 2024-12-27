import React, { useEffect, useState } from "react";
import { useMetamask } from "../context/MetamaskContext";
import coding from "../assets/coding.png";
import maths from "../assets/maths.png";
import security from "../assets/security.png";

const slides = [
  {
    text: "Test and enhance your skills in coding, mathematics, and security!",
    image: coding,
  },
  {
    text: "Submit your flags to our smart contract and see your score skyrocket!",
    image: maths,
  },
  {
    text: "New challenges appear regularly. Get ready to compete and have fun!",
    image: security,
  },
];

const SLIDE_DURATION = 3000;

export default function Home() {
  const { userAddress } = useMetamask();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, SLIDE_DURATION);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="text-center">
      <h1 className="text-sky-500 text-2xl font-bold my-8">
        Welcome to SmartChallenge (refactored)!
      </h1>
      <div className="relative mx-auto max-w-xl h-80 overflow-hidden rounded shadow-lg">
        {slides.map((slide, i) => (
          <div
            key={i}
            className={`absolute inset-0 flex flex-col items-center justify-center p-4 transition-opacity duration-700 ${
              i === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={slide.image}
              alt="Slide"
              className="mx-auto mb-4 max-h-40 object-contain"
            />
            <p className="text-base text-foreground">{slide.text}</p>
          </div>
        ))}
      </div>

      <div className="mt-8">
        {userAddress ? (
          <p className="text-sm text-muted-foreground">
            You are user:{" "}
            <span className="font-semibold text-foreground">{userAddress}</span>
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            Connect your wallet to start your challenge journey!
          </p>
        )}
      </div>
    </div>
  );
}
