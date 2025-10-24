"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import GlobalLoading from "../loading";
import { RxCross2 } from "react-icons/rx";
import { RxCheck } from "react-icons/rx";

export default function EmailConfirmationDefaultPage() {
  const { t } = useTranslation("emailConfirm");

  const searchParams = useSearchParams();

  const [status, setStatus] = useState<"verifying" | "success" | "error">(
    "verifying"
  );
  const [errorMessage, setErrorMessage] = useState("");
  const confirmationToken = searchParams.get("confirmation");

  const [resendEmail, setResendEmail] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [messageKeys, setMessageKeys] = useState<string[]>([]);
  const [messageType, setMessageType] = useState<"success" | "error" | null>(
    null
  );

  useEffect(() => {
    const confirmEmail = async () => {
      if (!confirmationToken) {
        setStatus("error");
        setErrorMessage(t("error.noToken"));
        return;
      }
      try {
        const apiUrl = `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/auth/email-confirmation?confirmation=${confirmationToken}`;
        await axios.get(apiUrl, {
          maxRedirects: 0,
          validateStatus: (s) => s >= 200 && s < 400,
        });
        setStatus("success");
      } catch (error) {
        console.error("Verification failed:", error);
        setStatus("error");
        if (axios.isAxiosError(error) && error.response) {
          setErrorMessage(t("error.tokenInvalid"));
        } else {
          setErrorMessage(t("error.network"));
        }
      }
    };
    confirmEmail();
  }, [confirmationToken, t]);

  const handleResendLink = async () => {
    setMessageKeys([]);
    setMessageType(null);

    if (resendLoading || !resendEmail) {
      setMessageKeys(["resend.emailRequired"]);
      setMessageType("error");
      return;
    }

    setResendLoading(true);

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/auth/send-email-confirmation`,
        { email: resendEmail }
      );
      setMessageKeys(["resend.successMessage"]);
      setMessageType("success");
    } catch (err) {
      console.error(err);
      setMessageKeys(["resend.errorMessage"]);
      setMessageType("error");
    } finally {
      setResendLoading(false);
    }
  };

  if (!confirmationToken) {
    return <GlobalLoading />;
  }

  return (
    <main className="md:px-0 px-3 fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-white/10 backdrop-blur-sm z-[999]">
      <div className="w-full md:pr-25">
        <div className="text-center p-10 bg-white/10 backdrop-blur-sm border border-white/30 shadow-md rounded-4xl max-w-md w-full mx-auto">
          {status === "verifying" && (
            <>
              <div className="w-16 h-16 mx-auto border-4 border-white/30 border-t-white rounded-full animate-spin" />
              <p className="mt-6 text-xl text-white/80">
                {t("status.verifying")}
              </p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="w-20 h-20 mx-auto bg-green-500/20 backdrop-blur-sm border border-white/30 shadow-md rounded-full flex items-center justify-center">
                <RxCheck size={56} className="text-green-400" />
              </div>
              <p className="mt-4 text-2xl font-semibold text-green-400/80">
                {t("status.successTitle")}
              </p>
              <p className="mt-2 text-white/80">{t("status.successBody")}</p>
            </>
          )}

          {status === "error" && (
            <>
              <div className="w-20 h-20 mx-auto bg-red-500/20 backdrop-blur-sm border border-white/30 shadow-md rounded-full flex items-center justify-center">
                <RxCross2 size={52} className="text-red-400" />
              </div>
              <p className="mt-4 text-2xl font-semibold text-red-400/80">
                {t("status.errorTitle")}
              </p>
              <p className="mt-2 text-white/80">{errorMessage}</p>

              <div className="mt-6 border-t border-white/20 pt-6 space-y-4">
                <p className="text-white/80">{t("resend.prompt")}</p>

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

                <input
                  type="email"
                  value={resendEmail}
                  onChange={(e) => setResendEmail(e.target.value)}
                  placeholder={t("resend.placeholder")}
                  className="text-white/80 w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/30 shadow-md rounded-4xl focus:ring-2 focus:ring-white/30 focus:outline-none"
                  disabled={resendLoading}
                />
                <button
                  onClick={handleResendLink}
                  disabled={resendLoading}
                  className={`text-white/80 w-full px-3 py-2 ${
                    !resendLoading
                      ? "hover:bg-white/30 hover:text-white/90 cursor-pointer"
                      : "opacity-50 cursor-not-allowed"
                  } bg-white/20 backdrop-blur-sm border border-white/30 shadow-md rounded-4xl transition-all`}
                >
                  {resendLoading
                    ? t("resend.buttonLoading")
                    : t("resend.button")}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
