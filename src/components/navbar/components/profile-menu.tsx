"use client";

import { usePathname, useRouter } from "next/navigation";
import React from "react";

export default function ProfileMenu({
  path,
  title,
  setToggle,
  onClose,
  setMenuToggle,
  icon,
  isLong = false,
}: {
  path: string;
  title: string;
  setToggle: (toggle: boolean) => void;
  onClose?: () => void;
  setMenuToggle?: () => void;
  icon: React.ReactNode;
  isLong?: boolean;
}) {
  const router = useRouter();

  const currentPath = usePathname();

  const handleClick = () => {
    router.push(path);
    if (setMenuToggle) {
      setMenuToggle();
    } else {
      setToggle(false);
    }
    onClose?.();
  };

  return (
    <div
      onClick={handleClick}
      className={`${
        currentPath === path
          ? "text-white bg-white/40"
          : "text-white/80 md:hover:bg-white/30 md:hover:text-white/90 cursor-pointer"
      } text-md transition-all px-3 pt-2`}
    >
      <div
        className={`flex items-center gap-3 ${
          isLong ? "items-start" : "items-center"
        }`}
      >
        {icon && <span className="text-xl">{icon}</span>}
        <span>{title}</span>
      </div>

      <div className="w-full h-[1px] bg-white/30 mt-2" />
    </div>
  );
}
