import { useState } from "react";

type Toast = {
  id: number;
  title: string;
  description?: string;
};

let _id = 0;

export function useToastInternal() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  function toast({ title, description }: { title: string; description?: string }) {
    const newToast = { id: ++_id, title, description };
    setToasts((prev) => [...prev, newToast]);

    // auto-remove after a few seconds
    setTimeout(() => {
      setToasts((current) => current.filter((t) => t.id !== newToast.id));
    }, 3500);
  }

  return {
    toasts,
    toast,
  };
}

/**
 * This is a global store for toasts. For a large app, you'd do a more robust approach.
 */
const globalToast: { fn: ((obj: { title: string; description?: string }) => void) | null } = {
  fn: null,
};

export function useToast() {
  // Expose a hook that calls the global toast function
  return {
    toast: (args: { title: string; description?: string }) => {
      globalToast.fn?.(args);
    },
  };
}

export function ToastManager() {
  const { toasts, toast } = useToastInternal();
  globalToast.fn = toast; // link global store to local store

  return { toasts };
}
