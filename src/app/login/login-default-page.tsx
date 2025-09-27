"use client";

import React from "react";
import { useTranslation } from "react-i18next";

export default function LoginDefaultPage({
  Login,
}: {
  Login: (formData: FormData) => void | Promise<void>;
}) {
  const { t } = useTranslation("login");

  return (
    <main className="w-full min-h-[91svh] max-w-[1920px] mx-auto">
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
