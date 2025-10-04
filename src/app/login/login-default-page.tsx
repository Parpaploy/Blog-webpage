"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSidebar } from "../../../hooks/sidebar";
import { useRouter } from "next/navigation";
import { Login } from "../../../lib/auth";

export default function LoginDefaultPage() {
  const { t } = useTranslation("login");
  const { isSidebar } = useSidebar();
  const router = useRouter();

  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error" | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setMessage(null);

    try {
      const formData = new FormData(e.currentTarget);
      const result = await Login(formData);

      if (result?.success) {
        router.push("/subscribe-blogs");
      } else {
        setMessage(t("loginFailed"));
        setMessageType("error");
      }
    } catch (err) {
      setMessage(t("unexpectedError"));
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className={`w-full h-full 2xl:pt-[7svh] xl:pt-[9svh] lg:pt-[8svh] md:pt-[5svh] ${
        isSidebar ? "pl-65" : "pl-25"
      } transition-all`}
    >
      <form
        onSubmit={handleSubmit}
        className="w-full space-y-5 max-w-sm mx-auto"
      >
        <h2 className="text-2xl font-bold text-center text-white/80">
          {t("title")}
        </h2>

        {message && (
          <div
            className={`text-center p-2 rounded ${
              messageType === "success" ? "text-green-400" : "text-red-400"
            }`}
          >
            {message}
          </div>
        )}

        <div className="flex flex-col gap-5 text-white/70">
          <input
            name="identifier"
            type="text"
            required
            placeholder={t("identifierPlaceholder")}
            className="px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/30 shadow-lg rounded-4xl focus:ring-2 focus:ring-white/30 focus:outline-none"
            disabled={loading}
          />

          <input
            name="password"
            type="password"
            required
            placeholder={t("passwordPlaceholder")}
            className="px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/30 shadow-lg rounded-4xl focus:ring-2 focus:ring-white/30 focus:outline-none"
            disabled={loading}
          />
        </div>

        <div className="w-full flex justify-end items-center -mt-4 -mb-0 pr-3">
          <a
            href="/forgot-password"
            className="text-blue-400/80 underline hover:text-white/80 transition-all text-end"
          >
            {t("forgotPassword")}
          </a>
        </div>

        <button
          type="submit"
          className="cursor-pointer text-white/80 w-full px-3 py-2 hover:bg-white/30 bg-white/20 backdrop-blur-sm border border-white/30 shadow-lg rounded-4xl transition-all"
          disabled={loading}
        >
          {loading ? t("loading") : t("loginButton")}
        </button>

        <div className="flex gap-1 items-center justify-center text-white/80">
          {t("noAccount")}
          <a
            href="/signup"
            className="underline cursor-pointer text-blue-400/80 hover:text-white/80 transition-all"
          >
            {t("signUp")}
          </a>
        </div>
      </form>
    </main>
  );
}
