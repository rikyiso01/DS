import React from "react";
import { Link } from "react-router-dom";
import { useUser } from "../components/context/UserContext";
import coding from "../assets/coding.png";
import maths from "../assets/maths.png";
import security from "../assets/security.png";

export default function Home() {
  const { userAddress } = useUser();
  const slides = [
    {
      text: "SmartChallenge is an innovative platform ...",
      image: coding,
    },
    {
      text: "Upon successful completion ... scoreboard.",
      image: maths,
    },
    {
      text: "New challenges will be added regularly, ... good luck!",
      image: security,
    },
  ];

  return (
    <div className="text-center">
      <h1 className="text-sky-500 my-2">Welcome to SmartChallenge@DIBRIS!</h1>
      {slides.map((slide, i) => (
        <div key={i} className="p-4 mx-auto max-w-md">
          <p>{slide.text}</p>
          <img src={slide.image} alt="slide" className="mx-auto" width={200} />
        </div>
      ))}
      {!userAddress ? (
        <Link to="/login" className="underline text-blue-600">
          Connect Wallet to Start!
        </Link>
      ) : (
        <p className="mt-4 text-sm">You are connected as {userAddress}</p>
      )}
    </div>
  );
}
