"use client";

import { usePathname, useRouter } from "next/navigation";
import React from "react";

export default function ProfileMenu({
  path,
  title,
  setToggle,
  onClose,
  haveLine = true,
}: {
  path: string;
  title: string;
  setToggle: (toggle: boolean) => void;
  onClose?: () => void;
  haveLine?: boolean;
}) {
  const router = useRouter();

  const currentPath = usePathname();

  return (
    <div
      onClick={() => {
        router.push(path);
        setToggle(false);
        onClose?.();
      }}
      className={`${
        currentPath === path
          ? "text-white bg-white/40"
          : "text-white/80 md:hover:bg-white/30 md:hover:text-white/90 cursor-pointer"
      } text-md transition-all px-3 pt-2 ${!haveLine && "pb-2"}`}
    >
      {title}

      {haveLine && <div className="w-full h-[1px] bg-white/30 mt-2" />}
    </div>
  );
}
