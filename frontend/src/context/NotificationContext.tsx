import React, { createContext, ReactNode, useContext, useState } from "react";
import * as Toast from "@radix-ui/react-toast";

interface Notification {
  title: string;
  description?: string;
  type?: "success" | "error" | "info";
}

interface NotificationContextType {
  notify: (notification: Notification) => void;
}

const NotificationContext = createContext<NotificationContextType>({
  notify: () => {},
});

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [currentNotification, setCurrentNotification] = useState<Notification>({
    title: "",
  });

  function notify(notification: Notification) {
    setCurrentNotification(notification);
    setOpen(true);
  }

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      <Toast.Provider>
        <Toast.Root
          className={`bg-white border rounded p-4 shadow-lg transition ${
            currentNotification.type === "success"
              ? "border-green-500"
              : currentNotification.type === "error"
              ? "border-red-500"
              : "border-blue-500"
          }`}
          open={open}
          onOpenChange={setOpen}
        >
          <Toast.Title className="font-semibold">
            {currentNotification.title}
          </Toast.Title>
          {currentNotification.description && (
            <Toast.Description className="text-sm text-gray-600 mt-2">
              {currentNotification.description}
            </Toast.Description>
          )}
        </Toast.Root>
        <Toast.Viewport className="fixed bottom-4 right-4 w-[320px] max-w-full z-50" />
      </Toast.Provider>
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  return useContext(NotificationContext);
}
