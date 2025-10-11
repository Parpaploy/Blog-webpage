"use client";

import { usePathname, useRouter } from "next/navigation";
import React from "react";

export default function ProfileMenu({
  path,
  title,
  setToggle,
}: {
  path: string;
  title: string;
  setToggle: (toggle: boolean) => void;
}) {
  const router = useRouter();

  const currentPath = usePathname();

  return (
    <div
      onClick={() => {
        router.push(path);
        setToggle(false);
      }}
      className={`${
        currentPath === path
          ? "text-white bg-white/40"
          : "text-white/80 hover:bg-white/30 hover:text-white/90 cursor-pointer"
      } text-md transition-all px-3 pt-2`}
    >
      {title}

      <div className="w-full h-[1px] bg-white/30 mt-2" />
    </div>
  );
}
