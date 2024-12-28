import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { Theme } from "@radix-ui/themes";
import { NotificationProvider } from "./context/NotificationContext";
import "@radix-ui/themes/styles.css";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Theme appearance="light" accentColor="blue" radius="large">
      <NotificationProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </NotificationProvider>
    </Theme>
  </React.StrictMode>
);
