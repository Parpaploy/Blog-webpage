"use client";

import React from "react";
import { IUser } from "../../../interfaces/strapi.interface";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../navbar/components/language-switcher";
import { useSidebar } from "../../../hooks/sidebar";

export default function SidebarDefault({
  isLoggedIn,
  user,
  Logout,
}: {
  isLoggedIn: boolean;
  user: IUser | null;
  Logout: (formData: FormData) => void | Promise<void>;
}) {
  const { t } = useTranslation("navbar");
  const { isSidebar, toggleSidebar } = useSidebar();

  return (
    <aside
      className={`fixed top-0 left-0 ${
        isSidebar ? "w-60" : "w-20"
      } h-full max-h-[1080px] p-3 transition-all`}
    >
      <main className="w-full h-full rounded-lg bg-amber-200">
        <div className="w-full h-full flex flex-col justify-between items-center">
          <button
            className="w-10 h-10 p-3 bg-white rounded-full"
            onClick={toggleSidebar}
          >
            {isSidebar ? "ปิด" : "เปิด"}
          </button>
          <LanguageSwitcher />
        </div>
      </main>
    </aside>
  );
}
