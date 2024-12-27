import React from "react";
import { ToastManager } from "./useToast";
import { ToastList } from "./Toast";

export function Toaster() {
  const { toasts } = ToastManager();
  return <ToastList toasts={toasts} />;
}
