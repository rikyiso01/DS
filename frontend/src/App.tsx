import React from "react";
import { Routes, Route } from "react-router-dom";
import { MetamaskContextProvider } from "./context/MetamaskContext";

// Pages
import Home from "./pages/Home";
import Challenges from "./pages/Challenges";
import ChallengeDetails from "./pages/ChallengeDetails";
import Leaderboard from "./pages/Leaderboard";

// Components
import Nav from "./components/Nav";

export default function App() {
  return (
    <MetamaskContextProvider>
      <Nav />
      <div className="mt-16 px-4 py-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/challenges" element={<Challenges />} />
          <Route path="/challenge/:id" element={<ChallengeDetails />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Routes>
      </div>
    </MetamaskContextProvider>
  );
}
