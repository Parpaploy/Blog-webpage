"use client";
import React from "react";
import { RxCheck, RxCross2 } from "react-icons/rx";
import { useTranslation } from "react-i18next";
import { usePathname, useRouter } from "next/navigation";

export default function DeleteSubscribeBlogPanel({
  onCancel,
  onConfirm,
  status = "confirm",
  error = "",
  onSuccess,
  isRefreshing = false,
}: {
  onCancel: () => void;
  onConfirm: () => void;
  status?: "confirm" | "deleting" | "success" | "error";
  error?: string;
  onSuccess?: () => void;
  isRefreshing?: boolean;
}) {
  const { t } = useTranslation("deleteBlog");

  const router = useRouter();

  const currentPath = usePathname();

  const isOnDetailPage =
    currentPath.startsWith("/subscribe-blogs/") ||
    currentPath.startsWith("/blogs/");

  return (
    <main className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-black/50 backdrop-blur-md z-[999]">
      <div className="text-center p-10 bg-white/10 border border-white/30 shadow-md rounded-4xl max-w-md w-full mx-4">
        {status === "confirm" && (
          <>
            <p className="mb-5 text-white text-lg">
              {t("confirm_message_subscribe")}
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={onCancel}
                className="cursor-pointer px-4 py-2 rounded-4xl shadow-md bg-white/20 border border-white/30 text-white/80 hover:text-white/90 hover:bg-white/30 transition-all"
              >
                {t("cancel_button")}
              </button>
              <button
                onClick={onConfirm}
                className="cursor-pointer px-4 py-2 rounded-4xl shadow-md bg-red-500/20 border border-white/30 text-white/80 hover:text-white/90 hover:bg-red-500/30 transition-all"
              >
                {t("delete_button")}
              </button>
            </div>
          </>
        )}

        {status === "deleting" && (
          <>
            <div className="w-16 h-16 mx-auto border-4 border-white/30 border-t-white rounded-full animate-spin" />
            <p className="mt-6 text-xl text-white/80">
              {t("deleting_message_subscribe")}
            </p>
          </>
        )}

        {status === "success" && (
          <>
            {isRefreshing ? (
              <>
                <div className="w-16 h-16 mx-auto border-4 border-white/30 border-t-white rounded-full animate-spin" />
                <p className="mt-6 text-xl text-white/80">
                  {t("refreshing_message")}
                </p>
              </>
            ) : (
              <>
                <div className="w-20 h-20 mx-auto bg-green-500/20 border border-white/30 shadow-md rounded-full flex items-center justify-center">
                  <RxCheck size={56} className="text-green-400" />
                </div>
                <p className="mt-4 text-2xl font-semibold text-green-400/80">
                  {t("success_title")}
                </p>
                <p className="mt-2 text-white/80">
                  {t("success_message_subscribe")}
                </p>
                {!isOnDetailPage && (
                  <button
                    onClick={onSuccess || onCancel}
                    className="cursor-pointer mt-3 text-white/80 w-full px-3 py-2 hover:bg-white/30 hover:text-white/90 bg-white/20 border border-white/30 shadow-md rounded-4xl transition-all"
                  >
                    {t("ok_button")}
                  </button>
                )}

                {currentPath !== "/" && (
                  <button
                    onClick={() => {
                      router.push("/");
                      onCancel();
                    }}
                    className="cursor-pointer mt-3 text-white/80 w-full px-3 py-2 hover:bg-white/30 hover:text-white/90 bg-white/20 border border-white/30 shadow-md rounded-4xl transition-all"
                  >
                    {t("homeButton")}
                  </button>
                )}
              </>
            )}
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-20 h-20 mx-auto bg-red-500/20 border border-white/30 shadow-md rounded-full flex items-center justify-center">
              <RxCross2 size={52} className="text-red-400" />
            </div>
            <p className="mt-4 text-2xl font-semibold text-red-400/80">
              {t("error_title")}
            </p>
            <p className="mt-2 text-white/80">
              {error || t("error_default_message_subscribe")}
            </p>
            <button
              onClick={onCancel}
              className="cursor-pointer mt-6 text-white/80 w-full px-3 py-2 hover:bg-white/30 hover:text-white/90 bg-white/20 border border-white/30 shadow-md rounded-4xl transition-all"
            >
              {t("close_button")}
            </button>
          </>
        )}
      </div>
    </main>
  );
}
