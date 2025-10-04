"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function ResetPasswordDefaultPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("code");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setMessage("❌ Invalid or missing token");
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || password !== confirmPassword) {
      setMessage("❌ Passwords do not match");
      return;
    }

    if (!token) return;

    setLoading(true);
    setMessage(null);

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
        setMessage("✅ Password reset successfully! Redirecting to login...");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        setMessage(data.error?.message || "❌ Failed to reset password");
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="w-full h-full flex items-center justify-center p-5">
      <form
        onSubmit={handleSubmit}
        className="bg-white/10 backdrop-blur-sm p-6 rounded-xl shadow-lg max-w-sm w-full space-y-5 text-white/80"
      >
        <h2 className="text-2xl font-bold text-center">Reset Password</h2>

        {message && (
          <div
            className={`p-3 rounded-lg text-center ${
              message.startsWith("✅")
                ? "bg-green-500/20 text-green-300"
                : "bg-red-500/20 text-red-300"
            }`}
          >
            {message}
          </div>
        )}

        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/30 shadow-lg rounded-4xl focus:ring-2 focus:ring-white/30 focus:outline-none"
          disabled={loading}
          required
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/30 shadow-lg rounded-4xl focus:ring-2 focus:ring-white/30 focus:outline-none"
          disabled={loading}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="cursor-pointer text-white/80 w-full px-3 py-2 hover:bg-white/30 bg-white/20 backdrop-blur-sm border border-white/30 shadow-lg rounded-4xl transition-all disabled:opacity-50"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </main>
  );
}
