import React from "react";

export default function SignButton({ title }: { title: string }) {
  return (
    <button type="submit" className="rounded-lg bg-red-400 p-2 cursor-pointer">
      {title}
    </button>
  );
}
