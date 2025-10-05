"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSidebar } from "../../../hooks/sidebar";

export default function VerificationDefaultPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("confirmation");
  const fromTab = searchParams.get("fromTab");
  const { t } = useTranslation("verification");

  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error" | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  const { isSidebar } = useSidebar();

  useEffect(() => {
    const confirmEmail = async () => {
      if (!token) {
        setMessage(t("invalid"));
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
          setMessage(t("success"));
          setMessageType("success");

          setTimeout(() => {
            if (fromTab) router.push(`/signup?tab=${fromTab}`);
            else router.push("/login");
          }, 2000);
        } else {
          if (data.error?.message === "Invalid token") {
            setMessage(t("alreadyVerified"));
            setMessageType("success");

            setTimeout(() => {
              router.push("/login");
            }, 2000);
          } else {
            setMessage(data.error?.message || t("invalid"));
            setMessageType("error");
          }
        }
      } catch (err) {
        console.error(err);
        setMessage(t("connectionError"));
        setMessageType("error");
      } finally {
        setLoading(false);
      }
    };

    confirmEmail();
  }, [token, t, fromTab, router]);

  return (
    <main
      className={`flex items-center justify-center w-full h-full overflow-y-auto 2xl:pt-[7svh] xl:pt-[9svh] lg:pt-[8svh] md:pt-[5svh] ${
        isSidebar ? "pl-65" : "pl-25"
      } transition-all`}
    >
      <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl shadow-lg text-center text-white/80">
        {loading && <p>{t("loading")}</p>}
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
