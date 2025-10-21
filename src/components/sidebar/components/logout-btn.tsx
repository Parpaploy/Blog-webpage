"use client";

import { useRouter } from "next/navigation";
import { ReactNode, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSidebar } from "../../../../hooks/sidebar";
import { CiLogout } from "react-icons/ci";

export default function LogoutButton({
  isLoggedIn,
  Logout,
  shortTitle,
  longTitle,
}: {
  isLoggedIn: boolean;
  Logout: (formData: FormData) => void | Promise<void>;
  shortTitle: ReactNode;
  longTitle: ReactNode;
}) {
  const { isSidebar } = useSidebar();
  const router = useRouter();
  const { t } = useTranslation("sidebar");
  const [isLogout, setIsLogout] = useState(false);

  const handleLogout = async () => {
    if (isLogout) return;

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
      className={`
        whitespace-nowrap h-10
        ${isSidebar ? "w-full" : "w-auto"}
        group backdrop-blur-sm border border-white/30 border-l-0 border-r-0 shadow-md px-2 py-1.75 transition-all relative
        ${
          isSidebar
            ? "rounded-3xl w-full px-3 text-start"
            : "rounded-full text-center w-11"
        } 
        ${
          !isLogout
            ? "text-white/50 hover:text-white/70 hover:bg-white/20 cursor-pointer"
            : "cursor-not-allowed opacity-50"
        }
      `}
    >
      {isLogout ? (
        <span
          className={`flex items-center gap-3 ${
            isSidebar ? "justify-start" : "justify-center px-0.5"
          }`}
        >
          <div
            className={`min-w-5 min-h-5 border-2 border-white/30 border-t-white rounded-full animate-spin`}
          />
          {isSidebar && (
            <span className="whitespace-nowrap">{t("loggingOut")}</span>
          )}
        </span>
      ) : isSidebar ? (
        longTitle
      ) : (
        shortTitle
      )}
    </button>
  );
}
