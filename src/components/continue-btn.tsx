"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { IoIosArrowForward } from "react-icons/io";

function ContinueButton({ path }: { path: string }) {
  const router = useRouter();

  return (
    <div
      onClick={() => {
        router.push(path);
      }}
      className="cursor-pointer hover:translate-x-1 transition-all"
    >
      <div className="hover:translate-x-1 transition-all w-fit h-fit">
        <IoIosArrowForward size={48} />
      </div>
    </div>
  );
}

export default ContinueButton;
