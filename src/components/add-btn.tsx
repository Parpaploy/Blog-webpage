"use client";

import { useRouter } from "next/navigation";
import { HiOutlinePencilAlt } from "react-icons/hi";

function AddButton() {
  const router = useRouter();

  return (
    <button
      className="cursor-pointer flex justify-center items-center text-white/80 hover:text-white/90 p-3 fixed bottom-5 right-5 rounded-full bg-white/10 hover:bg-white/30 transition-all backdrop-blur-sm border border-white/30 shadow-lg"
      onClick={() => {
        router.push("/add-blog");
      }}
    >
      <HiOutlinePencilAlt size={20} />
    </button>
  );
}

export default AddButton;
