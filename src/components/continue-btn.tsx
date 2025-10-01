"use client";

import React from "react";
import { IoIosArrowForward } from "react-icons/io";

function ContinueButton({ path }: { path: string }) {
  return (
    // <a href={path} className="p-3 border-2 border-black/70 rounded-full">
    //   <IoIosArrowForward size={32} />
    // </a>
    <a href={path} className="hover:translate-x-1 transition-all">
      <div className="hover:translate-x-1 transition-all w-fit h-fit">
        <IoIosArrowForward size={48} />
      </div>
    </a>
  );
}

export default ContinueButton;
