"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function VerificationDefaultPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("confirmation");
  const fromTab = searchParams.get("fromTab");

  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error" | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const confirmEmail = async () => {
      if (!token) {
        setMessage("❌ ลิงก์ยืนยันไม่ถูกต้อง");
        setMessageType("error");
        return;
      }

      setLoading(true);

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/auth/email-confirmation?confirmation=${token}`,
          { method: "GET", headers: { "Content-Type": "application/json" } }
        );

        const data = await res.json();

        if (res.ok) {
          // Token valid → redirect ไป tab เดิม
          setMessage("✅ ยืนยันบัญชีสำเร็จแล้ว! กลับไปยังหน้าเดิม...");
          setMessageType("success");

          setTimeout(() => {
            if (fromTab) router.push(`/signup?tab=${fromTab}`);
            else router.push("/login");
          }, 2000);
        } else {
          if (data.error?.message === "Invalid token") {
            // Token invalid แต่ user confirmed = true → redirect ไป login
            setMessage("✅ บัญชีนี้ถูกยืนยันแล้ว! กำลังไปยังหน้า login...");
            setMessageType("success");

            setTimeout(() => {
              router.push("/login");
            }, 2000);
          } else {
            // Token invalid จริง ๆ → แสดง error
            setMessage(
              data.error?.message || "❌ ลิงก์ยืนยันไม่ถูกต้องหรือหมดอายุ"
            );
            setMessageType("error");
          }
        }
      } catch (err) {
        console.error(err);
        setMessage("❌ เกิดข้อผิดพลาดในการเชื่อมต่อ");
        setMessageType("error");
      } finally {
        setLoading(false);
      }
    };

    confirmEmail();
  }, [token]);

  return (
    <main className="w-full h-full flex items-center justify-center p-5">
      <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl shadow-lg text-center text-white/80">
        {loading && <p>⏳ กำลังยืนยันบัญชี...</p>}
        {message && (
          <p
            className={
              messageType === "success"
                ? "text-green-400 font-semibold"
                : "text-red-400 font-semibold"
            }
          >
            {message}
          </p>
        )}
      </div>
    </main>
  );
}
