"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSidebar } from "../../../hooks/sidebar";
import { FaCheck } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import { useTranslation } from "react-i18next";

export default function ResetPasswordDefaultPage() {
  const { t } = useTranslation("resetPassword");

  const { isSidebar } = useSidebar();

  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("code");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [status, setStatus] = useState<"success" | "error" | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage(t("invalidToken"));
    }
  }, [token, t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || password !== confirmPassword) {
      setStatus("error");
      setMessage(t("passwordMismatch"));
      return;
    }

    if (!token) return;

    setLoading(true);
    setMessage(null);
    setStatus(null);

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
        setMessage(t("successMessage"));
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        setStatus("error");
        setMessage(data.error?.message || t("unexpectedError"));
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
      setMessage(t("unexpectedError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className={`w-full h-full 2xl:pt-[7svh] xl:pt-[9svh] lg:pt-[8svh] md:pt-[5svh] relative ${
        isSidebar ? "pl-65" : "pl-25"
      } transition-all relative`}
    >
      <form
        onSubmit={handleSubmit}
        className="max-w-sm mx-auto w-full space-y-5 text-white/80"
      >
        <h2 className="text-2xl font-bold text-center">{t("title")}</h2>

        {status === "success" && message && (
          <div
            className={`z-50 ${
              isSidebar ? "ml-65" : "ml-25"
            } text-white/70 2xl:mt-[7svh] xl:mt-[9svh] lg:mt-[8svh] md:mt-[5svh] transition-all absolute top-0 left-0 inset-0 flex flex-col items-center justify-center bg-green-500/10 backdrop-blur-sm border border-green-300/30 shadow-lg rounded-4xl p-4`}
          >
            <div className="mb-7 text-white/85 flex items-center not-only:justify-center w-35 h-35 object-cover rounded-full bg-green-500/10 backdrop-blur-sm border border-green-300/30 shadow-lg transition-all duration-200 group-hover:brightness-70">
              <FaCheck size={90} className="text-green-500/90" />
            </div>

            <h3 className="text-4xl font-bold text-green-400/80 mb-3">
              Success
            </h3>
            <p className="text-center text-white/70">{message}</p>
          </div>
        )}

        {status === "error" && message && (
          <div
            className={`z-50 ${
              isSidebar ? "ml-65" : "ml-25"
            } text-white/70 2xl:mt-[7svh] xl:mt-[9svh] lg:mt-[8svh] md:mt-[5svh] transition-all absolute top-0 left-0 inset-0 flex flex-col items-center justify-center bg-red-500/10 backdrop-blur-sm border border-red-300/30 shadow-lg rounded-4xl p-4`}
          >
            <div className="text-white/85 flex items-center not-only:justify-center w-35 h-35 mb-7 object-cover rounded-full bg-red-500/10 backdrop-blur-sm border border-red-300/30 shadow-lg transition-all duration-200 group-hover:brightness-70">
              <RxCross2 size={90} className="text-red-500/90" />
            </div>

            <h3 className="text-4xl font-bold text-red-400/80 mb-3">Error</h3>
            <p className="text-center text-white/70">{message}</p>
          </div>
        )}

        <input
          type="password"
          placeholder={t("newPasswordPlaceholder")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/30 shadow-lg rounded-4xl focus:ring-2 focus:ring-white/30 focus:outline-none"
          required
        />

        <input
          type="password"
          placeholder={t("confirmPasswordPlaceholder")}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/30 shadow-lg rounded-4xl focus:ring-2 focus:ring-white/30 focus:outline-none"
          disabled={loading}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="cursor-pointer text-white/80 w-full px-3 py-2 hover:bg-white/30 bg-white/20 backdrop-blur-sm border border-white/30 shadow-lg rounded-4xl transition-all"
        >
          {loading ? t("submitLoading") : t("submitButton")}
        </button>
      </form>
    </main>
  );
}
