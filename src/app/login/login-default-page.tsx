"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { useSidebar } from "../../../hooks/sidebar";
import { useRouter } from "next/navigation";
import { Login } from "../../../lib/auth";

export default function LoginDefaultPage() {
  const { t } = useTranslation("login");

  const { isSidebar } = useSidebar();

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      const result = await Login(formData);
      if (result?.success) router.push("/subscribe-blogs");
    } catch (err) {
      router.push("/login?error=Login+failed");
    }
  };

  return (
    <main
      className={`w-full h-full 2xl:pt-[7svh] xl:pt-[9svh] lg:pt-[8svh] md:pt-[5svh] ${
        isSidebar ? "pl-65" : "pl-25"
      } transition-all`}
    >
      <form onSubmit={handleSubmit} className="w-full space-y-5">
        <h2 className="text-2xl font-bold text-center text-white/80">
          {t("title")}
        </h2>

        <div className="flex flex-col gap-5 text-white/70">
          <input
            name="identifier"
            type="text"
            required
            placeholder="Email or username"
            className="px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/30 shadow-lg rounded-4xl focus:ring-2 focus:ring-white/30 focus:outline-none"
          />

          <input
            name="password"
            type="password"
            required
            placeholder="Password"
            className="px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/30 shadow-lg rounded-4xl focus:ring-2 focus:ring-white/30 focus:outline-none"
          />
        </div>

        {/* Message: {state?.message} */}

        <button
          type="submit"
          className="cursor-pointer text-white/80 w-full px-3 py-2 hover:bg-white/30 bg-white/20 backdrop-blur-sm border border-white/30 shadow-lg rounded-4xl transition-all"
        >
          Login
        </button>

        <div className="flex gap-1 items-center justify-center text-white/80">
          Don't have an account?
          <a
            href="/signup"
            className="underline cursor-pointer text-blue-400 transition-all"
          >
            Sing Up
          </a>
        </div>
      </form>
    </main>
  );
}
