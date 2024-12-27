import React from "react";
import { Flex, Card, Text } from "@radix-ui/themes";

export interface ToastData {
  id: number;
  title: string;
  description?: string;
}

export function ToastItem({ toast }: { toast: ToastData }) {
  return (
    <Card variant="surface" className="p-3 my-2 bg-white shadow-md w-80">
      <Text weight="bold">{toast.title}</Text>
      {toast.description && <Text size="2">{toast.description}</Text>}
    </Card>
  );
}

export function ToastList({ toasts }: { toasts: ToastData[] }) {
  return (
    <Flex direction="column" gap="2" className="fixed bottom-4 right-4 z-50">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} />
      ))}
    </Flex>
  );
}
