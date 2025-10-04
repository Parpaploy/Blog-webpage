"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSidebar } from "../../../hooks/sidebar";
import axios from "axios";

export default function SignupDefaultPage() {
  const { t } = useTranslation("signup");
  const { isSidebar } = useSidebar();

  const [messageKeys, setMessageKeys] = useState<string[]>([]);
  const [messageType, setMessageType] = useState<"success" | "error" | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  const backendMessageMap: Record<string, string> = {
    "username already taken": "usernameTaken",
    "email already taken": "emailTaken",
    "Validation error": "validationError",
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessageKeys([]);
    setMessageType(null);

    const formData = new FormData(e.currentTarget);
    const username = formData.get("username") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (!username || !email || !password || !confirmPassword) {
      setMessageKeys(["requiredFields"]);
      setMessageType("error");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setMessageKeys(["passwordMismatch"]);
      setMessageType("error");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/auth/local/register`,
        { username, email, password }
      );

      const user = res.data.user;

      if (user) {
        setMessageKeys(["signupSuccess"]);
        setMessageType("success");
      } else {
        setMessageKeys(["signupFailed"]);
        setMessageType("error");
      }
    } catch (err: any) {
      console.error(err);

      const backendMsg = err.response?.data?.error?.message;
      const key = backendMsg
        ? backendMessageMap[backendMsg] || "signupFailed"
        : "signupFailed";

      setMessageKeys([key]);
      setMessageType("error");
    }

    setLoading(false);
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

        {messageKeys.length > 0 && (
          <div
            className={`text-center p-2 rounded ${
              messageType === "success"
                ? "bg-green-500/20 text-green-300"
                : "bg-red-500/20 text-red-300"
            }`}
          >
            {messageKeys.map((k) => t(k)).join(" ")}
          </div>
        )}

        <div className="flex flex-col gap-5 text-white/70">
          <input
            name="username"
            type="text"
            required
            placeholder={t("usernamePlaceholder")}
            className="px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/30 shadow-lg rounded-4xl focus:ring-2 focus:ring-white/30 focus:outline-none"
            disabled={loading}
          />
          <input
            name="email"
            type="email"
            required
            placeholder={t("emailPlaceholder")}
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
          <input
            name="confirmPassword"
            type="password"
            required
            placeholder={t("confirmPasswordPlaceholder")}
            className="px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/30 shadow-lg rounded-4xl focus:ring-2 focus:ring-white/30 focus:outline-none"
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          className="cursor-pointer text-white/80 w-full px-3 py-2 hover:bg-white/30 bg-white/20 backdrop-blur-sm border border-white/30 shadow-lg rounded-4xl transition-all"
          disabled={loading}
        >
          {loading ? t("loading") : t("title")}
        </button>

        <div className="flex gap-1 items-center justify-center text-white/80">
          {t("alreadyHaveAccount")}
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
