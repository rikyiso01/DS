import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Challenges from "@/pages/Challenges";
import Challenge from "@/pages/Challenge";
import Leaderboard from "@/pages/Leaderboard";
import Users from "@/pages/Users";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/challenges" element={<Challenges />} />
      <Route path="/challenge/:id" element={<Challenge />} />
      <Route path="/leaderboard" element={<Leaderboard />} />
      <Route path="/users/:id" element={<Users />} />
      <Route path="*" element={<Home />} />
    </Routes>
  );
}
