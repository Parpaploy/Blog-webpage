"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSidebar } from "../../../hooks/sidebar";
import { useRouter, useSearchParams } from "next/navigation";
import { Login } from "../../../lib/auth";

export default function LoginDefaultPage() {
  const { t } = useTranslation("login");
  const { isSidebar } = useSidebar();
  const router = useRouter();

  const searchParams = useSearchParams();

  const [messageKeys, setMessageKeys] = useState<string[]>([]);
  const [messageType, setMessageType] = useState<"success" | "error" | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading || loginSuccess) return;

    setLoading(true);
    setMessageKeys([]);
    setMessageType(null);

    try {
      const formData = new FormData(e.currentTarget);
      const result = await Login(formData);

      if (result?.success) {
        setLoginSuccess(true);

        const callbackUrl = searchParams.get("callbackUrl") || "/";

        router.push(callbackUrl);
      } else {
        setMessageKeys(["loginFailed"]);
        setMessageType("error");
        setLoading(false);
      }
    } catch (err) {
      setMessageKeys(["unexpectedError"]);
      setMessageType("error");
      setLoading(false);
    }
  };

  return (
    <main
      className={`w-screen h-full 2xl:pt-[7svh] xl:pt-[9svh] lg:pt-[8svh] md:pt-[6svh] pt-[50%] ${
        isSidebar ? "md:pl-65 md:px-auto px-3" : "md:pl-25 md:px-auto px-3"
      } transition-all duration-300`}
    >
      <div className="w-full md:pr-25">
        <form
          onSubmit={handleSubmit}
          className="w-full space-y-5 md:max-w-sm mx-auto"
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
              name="identifier"
              type="text"
              required
              placeholder={t("identifierPlaceholder")}
              className="px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/30 shadow-md rounded-4xl focus:ring-2 focus:ring-white/30 focus:outline-none"
              disabled={loading}
            />

            <input
              name="password"
              type="password"
              required
              placeholder={t("passwordPlaceholder")}
              className="px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/30 shadow-md rounded-4xl focus:ring-2 focus:ring-white/30 focus:outline-none"
              disabled={loading}
            />
          </div>

          <div className="w-full flex justify-end items-center -mt-4 -mb-0 pr-3">
            <div
              onClick={() => {
                if (!loading) {
                  router.push("/forgot-password");
                }
              }}
              className={`text-blue-400/80 underline cursor-default ${
                !loading
                  ? "hover:text-white/80 cursor-pointer"
                  : "cursor-not-allowed"
              } transition-all text-end`}
            >
              {t("forgotPassword")}
            </div>
          </div>

          <button
            type="submit"
            className={`text-white/80 w-full px-3 py-2 cursor-default ${
              !loading
                ? "hover:bg-white/30 hover:text-white/90 cursor-pointer"
                : "opacity-50 cursor-not-allowed"
            }  bg-white/20 backdrop-blur-sm border border-white/30 shadow-md rounded-4xl transition-all`}
            disabled={loading}
          >
            {loading ? t("loading") : t("loginButton")}
          </button>

          <div className="flex gap-1 items-center justify-center text-white/80">
            {t("noAccount")}
            <div
              onClick={() => {
                if (!loading) {
                  router.push("/signup");
                }
              }}
              className={`underline text-blue-400/80 cursor-default ${
                !loading
                  ? "hover:text-white/80 cursor-pointer"
                  : "cursor-not-allowed"
              } transition-all`}
            >
              {t("signUp")}
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
