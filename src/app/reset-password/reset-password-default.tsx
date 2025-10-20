"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useSidebar } from "../../../hooks/sidebar";
import { useTranslation } from "react-i18next";
import { RxCheck, RxCross2 } from "react-icons/rx";

export default function ResetPasswordDefaultPage() {
  const { t } = useTranslation("resetPassword");

  const { isSidebar } = useSidebar();

  const searchParams = useSearchParams();
  const token = searchParams.get("code");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [messageKeys, setMessageKeys] = useState<string[]>([]);
  const [status, setStatus] = useState<"success" | "error" | null>(null);
  const [loading, setLoading] = useState(false);

  const backendMessageMap: Record<string, string> = {
    "Invalid code provided.": "invalidToken",
    "Password confirmation does not match": "passwordMismatch",
  };

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessageKeys(["invalidToken"]);
    }
  }, [token, t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || password !== confirmPassword) {
      setStatus("error");
      setMessageKeys(["passwordMismatch"]);
      return;
    }
    if (!token) return;
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/auth/reset-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code: token,
            password: password,
            passwordConfirmation: confirmPassword,
          }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setMessageKeys(["successMessage"]);
      } else {
        const key = backendMessageMap[data.error?.message] || "unexpectedError";
        setStatus("error");
        setMessageKeys([key]);
      }
    } catch (err) {
      setStatus("error");
      setMessageKeys(["unexpectedError"]);
    } finally {
      setLoading(false);
    }
  };

  const handleTryAgain = () => {
    setStatus(null);
    setMessageKeys([]);
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <main
      className={`w-screen h-full 2xl:pt-[7svh] xl:pt-[9svh] lg:pt-[8svh] md:pt-[6svh] ${
        isSidebar ? "pl-65" : "pl-25"
      } transition-all`}
    >
      {status ? (
        <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-white/10 backdrop-blur-sm z-[999]">
          <div className="text-center p-10 bg-white/10 backdrop-blur-sm border border-white/30 shadow-md rounded-4xl max-w-md w-full">
            {status === "success" && (
              <>
                <div className="w-20 h-20 mx-auto bg-green-500/20 backdrop-blur-sm border border-white/30 shadow-md rounded-full flex items-center justify-center">
                  <RxCheck size={56} className="text-green-400" />
                </div>
                <p className="mt-4 text-2xl font-semibold text-green-400/80">
                  {t("successTitle")}
                </p>
                <p className="mt-2 text-white/80">
                  {messageKeys.map((k: any) => t(k)).join(" ")}
                </p>
                <p className="mt-2 text-white/80">{t("close")}</p>
              </>
            )}
            {status === "error" && (
              <>
                <div className="w-20 h-20 mx-auto bg-red-500/20 backdrop-blur-sm border border-white/30 shadow-md rounded-full flex items-center justify-center">
                  <RxCross2 size={52} className="text-red-400" />
                </div>
                <p className="mt-4 text-2xl font-semibold text-red-400/80">
                  {t("errorTitle")}
                </p>
                <p className="mt-2 text-white/80">
                  {messageKeys.map((k: any) => t(k)).join(" ")}
                </p>

                <button
                  type="button"
                  onClick={handleTryAgain}
                  className={`text-white/80 w-full px-3 py-2 mt-3 ${
                    !loading
                      ? "hover:bg-white/30 hover:text-white/90 cursor-pointer"
                      : "opacity-50 cursor-not-allowed"
                  } bg-white/20 backdrop-blur-sm border border-white/30 shadow-md rounded-4xl transition-all`}
                >
                  {t("tryAgainButton")}
                </button>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="w-full pr-25">
          <form
            onSubmit={handleSubmit}
            className="max-w-sm mx-auto w-full space-y-5 text-white/80"
          >
            <h2 className="text-2xl font-bold text-center">{t("title")}</h2>

            <input
              type="password"
              placeholder={t("newPasswordPlaceholder")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/30 shadow-md rounded-4xl focus:ring-2 focus:ring-white/30 focus:outline-none"
              required
            />
            <input
              type="password"
              placeholder={t("confirmPasswordPlaceholder")}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/30 shadow-md rounded-4xl focus:ring-2 focus:ring-white/30 focus:outline-none"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="cursor-pointer text-white/80 w-full px-3 py-2 hover:bg-white/30 bg-white/20 backdrop-blur-sm border border-white/30 shadow-md rounded-4xl transition-all"
            >
              {loading ? t("submitLoading") : t("submitButton")}
            </button>
          </form>
        </div>
      )}
    </main>
  );
}
