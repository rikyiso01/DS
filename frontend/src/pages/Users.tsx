import React from "react";
import { useParams } from "react-router-dom";
import { Text } from "@radix-ui/themes";

export default function Users() {
  const { id } = useParams();
  return (
    <Text size="5" className="mt-4 text-center">
      User ID: {id}
    </Text>
  );
}
