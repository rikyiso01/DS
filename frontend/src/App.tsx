import React from "react";
import { BrowserRouter } from "react-router-dom";
import { UserContextProvider } from "@/components/context/UserContext";
import AppRoutes from "@/router";
import NavBar from "@/components/ui/NavBar";
import { Toaster } from "@/components/ui/Toaster";

function App() {
  return (
    <BrowserRouter>
      <UserContextProvider>
        <NavBar />
        <div className="mx-auto pt-[80px] pb-8 max-w-7xl">
          <AppRoutes />
        </div>
        <Toaster />
      </UserContextProvider>
    </BrowserRouter>
  );
}

export default App;
