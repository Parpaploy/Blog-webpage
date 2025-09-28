import React, { ReactNode } from "react";

export default function SignButton({ title }: { title: ReactNode }) {
  return (
    <button type="submit" className="rounded-lg bg-red-400 p-2 cursor-pointer">
      {title}
    </button>
  );
}
