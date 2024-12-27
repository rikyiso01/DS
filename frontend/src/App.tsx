import React from "react";
import { Routes, Route } from "react-router-dom";
import { Theme } from "@radix-ui/themes";

// context
import { UserContextProvider } from "./components/context/UserContext";

// pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Challenges from "./pages/Challenges";
import ChallengeDetails from "./pages/ChallengeDetails";
import Leaderboard from "./pages/Leaderboard";
import UserPage from "./pages/User";

// UI
import Nav from "./components/ui/Nav";
// import { Toaster } from "./components/ui/toaster";  // from your old code
import "./index.css";

export default function App() {
  return (
    <Theme appearance="light" accentColor="blue" radius="large">
      <UserContextProvider>
        <Nav />
        <div style={{ marginTop: "5rem", padding: "1rem" }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/challenges" element={<Challenges />} />
            <Route path="/challenge/:id" element={<ChallengeDetails />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/users/:id" element={<UserPage />} />
          </Routes>
        </div>
        {/* <Toaster /> */}
      </UserContextProvider>
    </Theme>
  );
}
