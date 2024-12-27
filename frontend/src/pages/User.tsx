import React from "react";
import { useParams } from "react-router-dom";

export default function UserPage() {
  const { id } = useParams();
  return (
    <div className="mt-20 text-center">
      <h1>User ID: {id}</h1>
    </div>
  );
}
