import React from "react";

export default function CategoryTag({ title }: { title: string }) {
  return <div className="text-white px-1 rounded-md bg-gray-400">{title}</div>;
}
