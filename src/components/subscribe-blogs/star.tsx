"use client";

import React from "react";
import { FaStar } from "react-icons/fa";

function Star() {
  return (
    <div className="absolute top-2 left-2 rounded-full bg-amber-300/50 border-1 border-white/30 z-20 p-4 backdrop-blur-sm shadow-md">
      <FaStar className="w-5 h-5 text-[#424EDD]/50 absolute top-[calc(50%-1px)] -translate-y-1/2 left-1/2 -translate-x-1/2 z-20" />
      <FaStar className="w-6 h-6 text-white/30 absolute top-[calc(50%-1px)] -translate-y-1/2 left-1/2 -translate-x-1/2 z-10" />
    </div>
  );
}

export default Star;
