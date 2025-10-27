"use client";

import { usePathname, useRouter } from "next/navigation";
import { IoAdd } from "react-icons/io5";

function AddButton({
  isSmall = false,
  setMenuPanel,
}: {
  isSmall?: boolean;
  setMenuPanel?: (menuPanel: boolean) => void;
}) {
  const router = useRouter();

  const currentPath = usePathname();

  return (
    <button
      className={`${
        currentPath === "/add-blog"
          ? "bg-white/30 text-white/90 border-white/40"
          : "text-white/80 hover:text-white/90 hover:bg-white/30 bg-white/10 border-white/30 cursor-pointer"
      } ${
        isSmall ? "p-0.75" : "p-2 fixed md:bottom-5 bottom-20 right-4.5"
      } flex justify-center items-center rounded-full transition-all backdrop-blur-sm border shadow-md`}
      onClick={() => {
        if (currentPath !== "/add-blog") {
          if (setMenuPanel) {
            setMenuPanel(false);
          }
          router.push("/add-blog");
        }
      }}
    >
      <IoAdd size={24} />
    </button>
  );
}

export default AddButton;
