"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSidebar } from "../../../hooks/sidebar";
import { requestResetPassword } from "../../../lib/apis/profile-uploader";
import { ResetRequestResult } from "../../../interfaces/cms";

export default function ForgotPasswordDefaultPage() {
  const { t } = useTranslation("forgotPassword");

  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const { isSidebar } = useSidebar();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userEmail) return;

    setLoading(true);
    setMessage(null);

    try {
      const result: ResetRequestResult = await requestResetPassword(userEmail);

      if (result.success) {
        setMessage(result.message || t("success"));
        setUserEmail("");
      } else {
        const errorMessage = result.error || t("unexpectedError");
        setMessage(`${t("errorPrefix")}${errorMessage}`);
      }
    } catch (error) {
      setMessage(t("unexpectedError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className={`w-full h-full 2xl:pt-[7svh] xl:pt-[9svh] lg:pt-[8svh] md:pt-[5svh] ${
        isSidebar ? "pl-65" : "pl-25"
      } transition-all relative`}
    >
      <form
        onSubmit={handleSubmit}
        className="w-full space-y-5 max-w-sm mx-auto p-4"
      >
        <h2 className="text-2xl font-bold text-center text-white/80">
          {t("title")}
        </h2>

        <p className="text-center text-white/70">{t("subtitle")}</p>

        {message && (
          <div
            className={`p-3 rounded-lg text-center ${
              message.startsWith(t("errorPrefix").trim())
                ? "bg-red-500/20 text-red-300"
                : "bg-green-500/20 text-green-300"
            }`}
          >
            {message}
          </div>
        )}

        <div className="flex flex-col gap-5 text-white/70">
          <input
            name="email"
            type="email"
            required
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            placeholder={t("emailPlaceholder")}
            className="px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/30 shadow-lg rounded-4xl focus:ring-2 focus:ring-white/30 focus:outline-none"
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          className="cursor-pointer text-white/80 w-full px-3 py-2 hover:bg-white/30 bg-white/20 backdrop-blur-sm border border-white/30 shadow-lg rounded-4xl transition-all disabled:opacity-50"
          disabled={loading}
        >
          {loading ? t("sending") : t("submitButton")}
        </button>

        <div className="flex gap-1 items-center justify-center text-white/80">
          {t("rememberPassword")}
          <a
            href="/login"
            className="underline cursor-pointer text-blue-400/80 hover:text-white/80 transition-all"
          >
            {t("login")}
          </a>
        </div>
      </form>
    </main>
  );
}
