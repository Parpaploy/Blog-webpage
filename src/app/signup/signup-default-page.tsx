"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSidebar } from "../../../hooks/sidebar";
import axios from "axios";

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
      setMessage("กรุณากรอกทุกช่องให้ครบ");
      setLoading(false);
      return;
    }

    try {
      // ✅ Signup ผ่าน Strapi
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
        setMessage("สมัครเรียบร้อย! กรุณายืนยันอีเมลของคุณ");
      } else {
        setMessage("Signup failed");
      }
    } catch (err: any) {
      console.error(err);
      const errorMsg = err.response?.data?.error?.message || "Signup failed";
      setMessage(errorMsg);
    }

    setLoading(false);
  };

  const handleResend = async () => {
    if (!emailForVerification) return;
    setLoading(true);

    try {
      // ✅ Resend email ผ่าน Strapi endpoint โดยตรง
      await axios.post(
        `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/auth/forgot-password`,
        {
          email: emailForVerification,
          url: `${window.location.origin}/login`, // Strapi จะส่งลิงก์ยืนยันอีเมลให้
        }
      );

      setMessage("ส่งลิงก์ยืนยันอีเมลเรียบร้อยแล้ว!");
    } catch (err: any) {
      console.error(err);
      const errorMsg =
        err.response?.data?.error?.message || "ส่งลิงก์ไม่สำเร็จ";
      setMessage(errorMsg);
    }

    setLoading(false);
  };

  return (
    <main
      className={`w-full h-full 2xl:pt-[7svh] xl:pt-[9svh] lg:pt-[8svh] md:pt-[5svh] ${
        isSidebar ? "pl-65" : "pl-25"
      } transition-all`}
    >
      <form onSubmit={handleSubmit} className="w-full space-y-5 relative">
        <h2 className="text-2xl font-bold text-center text-white/80">
          {t("title")}
        </h2>

        <div className="flex flex-col gap-5 text-white/70">
          <input
            name="username"
            type="text"
            required
            placeholder="Username"
            className="px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/30 shadow-lg rounded-4xl focus:ring-2 focus:ring-white/30 focus:outline-none"
          />
          <input
            name="email"
            type="email"
            required
            placeholder="Email"
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

        <button
          type="submit"
          className="cursor-pointer text-white/80 w-full px-3 py-2 hover:bg-white/30 bg-white/20 backdrop-blur-sm border border-white/30 shadow-lg rounded-4xl transition-all"
          disabled={loading}
        >
          Sign Up
        </button>

        {emailForVerification && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 rounded-4xl p-4">
            <h3 className="text-xl font-bold text-green-400">
              ✅ สมัครเรียบร้อย!
            </h3>
            <p className="mt-2 text-white/80 text-center">
              กรุณายืนยันอีเมลของคุณ: <strong>{emailForVerification}</strong>
            </p>
            <button
              onClick={handleResend}
              disabled={loading}
              className="mt-4 px-3 py-2 text-blue-400 underline"
            >
              {loading ? "กำลังส่ง..." : "ส่งลิงก์ยืนยันใหม่"}
            </button>
            {message && (
              <p className="mt-2 text-white/70 text-center">{message}</p>
            )}
          </div>
        )}

        {message && !emailForVerification && (
          <div className="text-red-400 flex items-center justify-end w-full">
            <p className="w-fit px-3 py-1 rounded-full bg-red-500/30 backdrop-blur-md border border-red-300/50 shadow-lg font-medium transition-all hover:bg-red-500/50 cursor-default">
              {message}
            </p>
          </div>
        )}

        <div className="flex gap-1 items-center justify-center text-white/80">
          Already have an account?
          <a
            href="/login"
            className="underline cursor-pointer text-blue-400 transition-all"
          >
            Login
          </a>
        </div>
      </form>
    </main>
  );
}
