"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { useSidebar } from "../../../hooks/sidebar";

export default function LoginDefaultPage({
  Login,
}: {
  Login: (formData: FormData) => void | Promise<void>;
}) {
  const { t } = useTranslation("login");

  const { isSidebar } = useSidebar();

  return (
    <main
      className={`w-full h-full ${
        isSidebar ? "pl-65" : "pl-25"
      } transition-all`}
    >
      <form action={Login}>
        <div>
          Email
          <input
            name="email"
            type="email"
            required
            className="border-1 border-gray-400"
          />
        </div>
        <div>
          Password
          <input
            name="password"
            type="password"
            required
            className="border-1 border-gray-400"
          />
        </div>
        {/* Message: {state?.message} */}
        <div>
          <button className="bg-blue-400 p-2 cursor-pointer">Login</button>
        </div>
      </form>
    </main>
  );
}
