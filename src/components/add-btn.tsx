"use client";

import { useRouter } from "next/navigation";
import { IoAdd } from "react-icons/io5";

function AddButton() {
  const router = useRouter();

  return (
    <button
      className="cursor-pointer flex justify-center items-center text-white/80 hover:text-white/90 p-2 fixed md:bottom-5 bottom-20 right-4.5 rounded-full bg-white/10 hover:bg-white/30 transition-all backdrop-blur-sm border border-white/30 shadow-md"
      onClick={() => {
        router.push("/add-blog");
      }}
    >
      <IoAdd size={24} />
    </button>
  );
}

export default AddButton;
