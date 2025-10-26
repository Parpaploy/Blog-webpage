"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSidebar } from "../../../hooks/sidebar";
import { requestResetPassword } from "../../../lib/apis/profile-uploader";
import { ResetRequestResult } from "../../../interfaces/cms";
import { useRouter } from "next/navigation";

export default function ForgotPasswordDefaultPage() {
  const { t } = useTranslation("forgotPassword");
  const { isSidebar } = useSidebar();

  const router = useRouter();

  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [messageKey, setMessageKey] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error" | null>(
    null
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userEmail) return;

    setLoading(true);
    setMessageKey(null);
    setMessageType(null);

    try {
      const result: ResetRequestResult = await requestResetPassword(userEmail);

      const apiMessageKeyMap: Record<string, string> = {
        "If a user with this email exists, a password reset link has been sent.":
          "success",
        "Email not found": "emailNotFound",
        "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง": "unexpectedError",
      };

      const key =
        apiMessageKeyMap[result.message || result.error || ""] ||
        "unexpectedError";

      setMessageKey(key);
      setMessageType(result.success ? "success" : "error");
      if (result.success) setUserEmail("");
    } catch (error) {
      setMessageKey("unexpectedError");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className={`w-screen h-full 2xl:pt-[7svh] xl:pt-[9svh] lg:pt-[8svh] md:pt-[6svh] pt-[50%] ${
        isSidebar ? "md:pl-65" : "md:pl-25"
      } transition-all duration-300 relative`}
    >
      <div className="w-full md:pr-25">
        <form
          onSubmit={handleSubmit}
          className="w-full space-y-5 max-w-sm mx-auto p-4"
        >
          <h2 className="text-2xl font-bold text-center text-white/80">
            {t("title")}
          </h2>
          <p className="text-center text-white/70">{t("subtitle")}</p>

          {messageKey && (
            <div
              className={`text-center p-2 rounded ${
                messageType === "success"
                  ? "bg-green-500/20 text-green-300"
                  : "bg-red-500/20 text-red-300"
              }`}
            >
              {t(messageKey)}
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
              className="px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/30 shadow-md rounded-4xl focus:ring-2 focus:ring-white/30 focus:outline-none"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="cursor-pointer text-white/80 w-full px-3 py-2 hover:bg-white/30 bg-white/20 backdrop-blur-sm border border-white/30 shadow-md rounded-4xl transition-all disabled:opacity-50"
            disabled={loading}
          >
            {loading ? t("sending") : t("submitButton")}
          </button>

          <div className="flex gap-1 items-center justify-center text-white/80">
            {t("rememberPassword")}
            <div
              onClick={() => {
                router.push("/login");
              }}
              className="underline cursor-pointer text-blue-400/80 hover:text-white/80 transition-all"
            >
              {t("login")}
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
