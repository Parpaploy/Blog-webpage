"use client";

import { useTranslation } from "react-i18next";
import { RxCheck, RxCross2 } from "react-icons/rx";
import { ISubmissionStatusModalProps } from "../../../interfaces/props.interface";

export default function SubmissionStatusModal({
  status,
  error,
  onSuccessRedirect,
  onClose,
}: ISubmissionStatusModalProps) {
  const { t } = useTranslation("addBlog");

  if (!status) {
    return null;
  }

  return (
    <main className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-black/50 backdrop-blur-md z-[999]">
      <div className="text-center p-10 bg-white/10 border border-white/30 shadow-md rounded-4xl max-w-md w-full mx-4">
        {status === "submitting" && (
          <>
            <div className="w-16 h-16 mx-auto border-4 border-white/30 border-t-white rounded-full animate-spin" />
            <p className="mt-6 text-xl text-white/80">
              {t("status.submitting")}
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="w-20 h-20 mx-auto bg-green-500/20 border border-white/30 shadow-md rounded-full flex items-center justify-center">
              <RxCheck size={56} className="text-green-400" />
            </div>
            <p className="mt-4 text-2xl font-semibold text-green-400/80">
              {t("status.successTitle")}
            </p>
            <p className="mt-2 text-white/80">{t("status.successBody")}</p>
            <button
              onClick={onSuccessRedirect}
              className="cursor-pointer mt-6 text-white/80 w-full px-3 py-2 hover:bg-white/30 hover:text-white/90 bg-white/20 border border-white/30 shadow-md rounded-4xl transition-all"
            >
              {t("status.successButton")}
            </button>
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-20 h-20 mx-auto bg-red-500/20 border border-white/30 shadow-md rounded-full flex items-center justify-center">
              <RxCross2 size={52} className="text-red-400" />
            </div>
            <p className="mt-4 text-2xl font-semibold text-red-400/80">
              {t("status.errorTitle")}
            </p>
            <p className="mt-2 text-white/80">{error}</p>
            <button
              onClick={onClose}
              className="cursor-pointer mt-6 text-white/80 w-full px-3 py-2 hover:bg-white/30 hover:text-white/90 bg-white/20 border border-white/30 shadow-md rounded-4xl transition-all"
            >
              {t("status.errorButton")}
            </button>
          </>
        )}
      </div>
    </main>
  );
}
