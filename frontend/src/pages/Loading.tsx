import React from "react";
import { Flex } from "@radix-ui/themes";

export default function Loading() {
  return (
    <Flex justify="center" align="center" className="mt-8">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-sky-500"></div>
    </Flex>
  );
}
