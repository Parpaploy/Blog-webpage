"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import { useSidebar } from "../../../hooks/sidebar";
import { useTranslation } from "react-i18next";

export default function VerificationDefaultPage() {
  const { isSidebar } = useSidebar();

  const { t } = useTranslation("verification");

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
  }, [token, t]);

  return (
    <main
      className={`flex justify-center items-center w-full h-full 2xl:pt-[7svh] xl:pt-[9svh] lg:pt-[8svh] md:pt-[5svh] ${
        isSidebar ? "pl-65" : "pl-25"
      } transition-all relative`}
    >
      {loading && (
        <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl text-center border-1 border-white/20 shadow-lg text-white/80">
          <p>{t("loading")}</p>
        </div>
      )}
      {message && (
        <div
          className={`absolute top-0 left-0 inset-0 transition-all 2xl:h-[92%] xl:h-[89%] lg:h-[90.5%] md:h-[94%] 2xl:mt-[7svh] xl:mt-[9svh] lg:mt-[8svh] md:mt-[5svh] ${
            isSidebar ? "ml-65" : "ml-25"
          } flex flex-col justify-center items-center backdrop-blur-sm p-6 rounded-4xl text-center border-1 shadow-lg text-white/80 ${
            messageType === "success"
              ? "bg-green-500/10 border-green-300/30"
              : "bg-red-500/10 border-red-300/30"
          }`}
        >
          <div className="flex flex-col items-center justify-center">
            {messageType === "success" ? (
              <div className="mb-7 text-white/85 flex items-center not-only:justify-center w-35 h-35 object-cover rounded-full bg-green-500/10 backdrop-blur-sm border border-green-300/30 shadow-lg transition-all duration-200 group-hover:brightness-70">
                <FaCheck size={90} className="text-green-500/90" />
              </div>
            ) : (
              <div className="text-white/85 flex items-center not-only:justify-center w-35 h-35 mb-7 object-cover rounded-full bg-red-500/10 backdrop-blur-sm border border-red-300/30 shadow-lg transition-all duration-200 group-hover:brightness-70">
                <RxCross2 size={90} className="text-red-500/90" />
              </div>
            )}

            <p
              className={`
               ${
                 messageType === "success"
                   ? "text-green-400/80 font-semibold"
                   : "text-red-400/80 font-semibold"
               }
                text-2xl
              `}
            >
              {message}
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
