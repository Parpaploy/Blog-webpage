"use client";

import React from "react";
import { FaStar } from "react-icons/fa";

function Star() {
  return (
    <div className="absolute top-2 left-2 rounded-full bg-amber-300/50 border-1 border-white/30 z-20 md:p-4 p-2.5 backdrop-blur-sm shadow-md">
      <FaStar className="md:w-5 md:h-5 w-4 h-4 text-[#424EDD]/50 absolute top-[calc(50%-1px)] -translate-y-1/2 left-1/2 -translate-x-1/2 z-20" />
      <FaStar className="md:w-6 md:h-6 w-4 h-5 text-white/30 absolute top-[calc(50%-1px)] -translate-y-1/2 left-1/2 -translate-x-1/2 z-10" />
    </div>
  );
}

export default Star;
