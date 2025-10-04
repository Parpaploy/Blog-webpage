"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSidebar } from "../../../hooks/sidebar";
import axios from "axios";
import { HiOutlineMailOpen } from "react-icons/hi";

export default function SignupDefaultPage() {
  const { t } = useTranslation("signup");
  const { isSidebar } = useSidebar();

  const [emailForVerification, setEmailForVerification] = useState<
    string | null
  >(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    const username = formData.get("username") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!username || !email || !password) {
      setMessage(t("requiredFields"));
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/auth/local/register`,
        {
          username,
          email,
          password,
        }
      );

      const user = res.data.user;

      if (user) {
        setEmailForVerification(user.email);
        setMessage(t("signupSuccess"));
      } else {
        setMessage(t("signupFailed"));
      }
    } catch (err: any) {
      console.error(err);
      const errorMsg = err.response?.data?.error?.message || t("signupFailed");
      setMessage(errorMsg);
    }

    setLoading(false);
  };

  const handleResend = async () => {
    if (!emailForVerification) return;
    setLoading(true);

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/auth/forgot-password`,
        {
          email: emailForVerification,
          url: `${window.location.origin}/login`,
        }
      );

      setMessage(t("resendSuccess"));
    } catch (err: any) {
      console.error(err);
      const errorMsg = err.response?.data?.error?.message || t("resendFailed");
      setMessage(errorMsg);
    }

    setLoading(false);
  };

  return (
    <main
      className={`w-full h-full 2xl:pt-[7svh] xl:pt-[9svh] lg:pt-[8svh] md:pt-[5svh] ${
        isSidebar ? "pl-65" : "pl-25"
      } transition-all relative`}
    >
      <form
        onSubmit={handleSubmit}
        className="w-full space-y-5 max-w-sm mx-auto"
      >
        <h2 className="text-2xl font-bold text-center text-white/80">
          {t("title")}
        </h2>

        <div className="flex flex-col gap-5 text-white/70">
          <input
            name="username"
            type="text"
            required
            placeholder={t("usernamePlaceholder")}
            className="px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/30 shadow-lg rounded-4xl focus:ring-2 focus:ring-white/30 focus:outline-none"
          />
          <input
            name="email"
            type="email"
            required
            placeholder={t("emailPlaceholder")}
            className="px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/30 shadow-lg rounded-4xl focus:ring-2 focus:ring-white/30 focus:outline-none"
          />
          <input
            name="password"
            type="password"
            required
            placeholder={t("passwordPlaceholder")}
            className="px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/30 shadow-lg rounded-4xl focus:ring-2 focus:ring-white/30 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="cursor-pointer text-white/80 w-full px-3 py-2 hover:bg-white/30 bg-white/20 backdrop-blur-sm border border-white/30 shadow-lg rounded-4xl transition-all"
          disabled={loading}
        >
          {t("title")}
        </button>

        {emailForVerification && (
          <div
            className={`${
              isSidebar ? "ml-65" : "ml-25"
            } text-white/70 2xl:mt-[7svh] xl:mt-[9svh] lg:mt-[8svh] md:mt-[5svh] transition-all absolute top-0 left-0 2xl:h-[92%] xl:h-[89%] lg:h-[90.5%] md:h-[94%] inset-0 flex flex-col items-center justify-center bg-green-500/10 backdrop-blur-sm border border-green-300/30 shadow-lg rounded-4xl p-4`}
          >
            <div className="text-white/85 flex items-center not-only:justify-center w-30 h-30 mb-5 object-cover rounded-full bg-white/10 backdrop-blur-sm border border-white/30 shadow-lg transition-all duration-200 group-hover:brightness-70">
              <HiOutlineMailOpen size={72} className="pb-1" />
            </div>

            <h3 className="text-4xl font-bold text-green-400/80">
              {t("verifyTitle")}
            </h3>
            <p className="mt-2 text-center">
              {t("verifySubtitle")}
              <br />
              <strong className="text-2xl text-white/80">
                {emailForVerification}
              </strong>
            </p>

            <p className="text-center mb-5">{t("verifyInstruction")}</p>

            <strong className="text-center">{t("verifyClose")}</strong>

            <p className="mt-5 text-center">{t("verifyResendPrompt")}</p>

            <button
              onClick={handleResend}
              disabled={loading}
              className="transition-all mt-4 px-3 py-2 text-lg text-white/70 hover:text-white font-medium bg-green-500/30 hover:bg-green-300/50 backdrop-blur-sm border border-green-300/30 shadow-lg rounded-xl cursor-pointer"
            >
              {loading ? t("resendLoading") : t("resendButton")}
            </button>
            {message && (
              <p className="mt-2 text-white/70 text-center">{message}</p>
            )}
          </div>
        )}

        {message && !emailForVerification && (
          <div
            className={`${
              isSidebar ? "ml-65" : "ml-25"
            } text-white/70 2xl:mt-[7svh] xl:mt-[9svh] lg:mt-[8svh] md:mt-[5svh] transition-all absolute top-0 left-0 2xl 2xl:h-[92%] xl:h-[89%] lg:h-[90.5%] md:h-[94%] inset-0 flex flex-col items-center justify-center bg-red-500/10 backdrop-blur-sm border border-red-300/30 shadow-lg rounded-4xl p-4`}
          >
            <h3 className="text-4xl font-bold text-red-400/80">
              {t("errorTitle")}
            </h3>

            <p className="mt-2 text-center">{t("errorSubtitle")}</p>

            <p>{message}</p>
          </div>
        )}

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
