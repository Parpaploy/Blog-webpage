"use client";

import { useRouter } from "next/navigation";
import { ReactNode, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSidebar } from "../../../../hooks/sidebar";
import { TbLogout } from "react-icons/tb";

export default function LogoutButton({
  isLoggedIn,
  Logout,
  longTitle,
}: {
  isLoggedIn: boolean;
  Logout: (formData: FormData) => void | Promise<void>;
  longTitle: ReactNode;
}) {
  const { isSidebar } = useSidebar();
  const router = useRouter();
  const { t } = useTranslation("sidebar");
  const [isLogout, setIsLogout] = useState(false);

  const handleLogout = async () => {
    setIsLogout(true);

    const formData = new FormData();
    await Logout(formData);

    router.push("/login");
  };

  if (!isLoggedIn) return null;

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isLogout}
      className={`${
        isSidebar ? "rounded-2xl w-full px-3" : "rounded-full w-10"
      } p-2 cursor-pointer hover:bg-white/20 text-white/50 hover:text-white/70 bg-white/10 border border-white/30 border-l-0 shadow-lg transition-all h-10`}
    >
      {isLogout ? (
        isSidebar ? (
          <span className="flex items-center gap-2">
            <TbLogout size={20} /> {t("loggingOut")}
          </span>
        ) : (
          <span className="flex justify-center">
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          </span>
        )
      ) : isSidebar ? (
        longTitle
      ) : (
        <span className="flex justify-center">
          <TbLogout size={20} className="transition-transform duration-300" />
        </span>
      )}
    </button>
  );
}
