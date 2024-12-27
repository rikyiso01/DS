import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";


ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Theme>
    <BrowserRouter>
      <App />
    </BrowserRouter>
    </Theme>
  </React.StrictMode>
);
