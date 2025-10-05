"use client";

import { useRouter } from "next/navigation";
import { HiOutlinePencilAlt } from "react-icons/hi";

function AddButton() {
  const router = useRouter();

  return (
    <button
      className="cursor-pointer flex justify-center items-center text-white/80 hover:text-white/90 p-5 absolute bottom-7 right-0 rounded-full bg-white/10 hover:bg-white/30 transition-all backdrop-blur-sm border border-white/30 shadow-lg"
      onClick={() => {
        router.push("/blogs");
      }}
    >
      <HiOutlinePencilAlt size={40} />
    </button>
  );
}

export default AddButton;
