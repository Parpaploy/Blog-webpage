"use client";

import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSidebar } from "../../../../hooks/sidebar";
import { CiLogout } from "react-icons/ci";

export default function LogoutButton({
  isLoggedIn,
  Logout,
  label,
  icon,
}: {
  isLoggedIn: boolean;
  Logout: (formData: FormData) => void | Promise<void>;
  label: string;
  icon: ReactNode;
}) {
  const { isSidebar } = useSidebar();
  const router = useRouter();
  const { t } = useTranslation("sidebar");
  const [isLogout, setIsLogout] = useState(false);
  const [showLabel, setShowLabel] = useState(isSidebar);

  const handleLogout = async () => {
    if (isLogout) return;

    setIsLogout(true);

    const formData = new FormData();
    await Logout(formData);

    router.push("/login");
  };

  useEffect(() => {
    if (isSidebar) {
      const timer = setTimeout(() => setShowLabel(true), 50);
      return () => clearTimeout(timer);
    } else {
      setShowLabel(false);
    }
  }, [isSidebar]);

  if (!isLoggedIn) return null;

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isLogout}
      className={`
        whitespace-nowrap h-10 text-white/50
        ${isSidebar ? "w-full" : "w-auto"}
        group backdrop-blur-sm border border-white/30 border-l-0 border-r-0 shadow-md px-2 py-1.75 transition-all duration-300 ease-in-out relative
        ${
          isSidebar
            ? "rounded-3xl w-full px-3 text-start"
            : "rounded-full text-center w-11"
        } 
        ${
          !isLogout
            ? "hover:text-white/70 hover:bg-white/20 cursor-pointer"
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
        <div className="flex items-stretch justify-start gap-5">
          <div className="w-[10%]">
            <CiLogout size={24} />
          </div>
          <div
            className={`w-[90%] transition-opacity duration-700 ${
              showLabel ? "opacity-100" : "opacity-0"
            }`}
          >
            {label}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center">{icon}</div>
      )}
    </button>
  );
}
