"use client";
import React from "react";
import { RxCheck, RxCross2 } from "react-icons/rx";

export default function DeleteFreeBlogPanel({
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
  return (
    <main className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-black/50 backdrop-blur-md z-[999]">
      <div className="text-center p-10 bg-white/10 border border-white/30 shadow-md rounded-4xl max-w-md w-full mx-4">
        {status === "confirm" && (
          <>
            <p className="mb-5 text-white text-lg">
              Are you sure you want to delete this blog?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={onCancel}
                className="cursor-pointer px-4 py-2 rounded-4xl shadow-md bg-white/20 border border-white/30 text-white/80 hover:text-white/90 hover:bg-white/30 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="cursor-pointer px-4 py-2 rounded-4xl shadow-md bg-red-500/20 border border-white/30 text-white/80 hover:text-white/90 hover:bg-red-500/30 transition-all"
              >
                Delete
              </button>
            </div>
          </>
        )}

        {status === "deleting" && (
          <>
            <div className="w-16 h-16 mx-auto border-4 border-white/30 border-t-white rounded-full animate-spin" />
            <p className="mt-6 text-xl text-white/80">Deleting blog...</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="w-20 h-20 mx-auto bg-green-500/20 border border-white/30 shadow-md rounded-full flex items-center justify-center">
              <RxCheck size={56} className="text-green-400" />
            </div>
            <p className="mt-4 text-2xl font-semibold text-green-400/80">
              Deleted Successfully
            </p>
            <p className="mt-2 text-white/80">
              Your blog has been deleted successfully.
            </p>
            <button
              onClick={onSuccess || onCancel}
              className="cursor-pointer mt-6 text-white/80 w-full px-3 py-2 hover:bg-white/30 hover:text-white/90 bg-white/20 border border-white/30 shadow-md rounded-4xl transition-all"
            >
              OK
            </button>
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-20 h-20 mx-auto bg-red-500/20 border border-white/30 shadow-md rounded-full flex items-center justify-center">
              <RxCross2 size={52} className="text-red-400" />
            </div>
            <p className="mt-4 text-2xl font-semibold text-red-400/80">
              Delete Failed
            </p>
            <p className="mt-2 text-white/80">
              {error || "An error occurred while deleting the blog."}
            </p>
            <button
              onClick={onCancel}
              className="cursor-pointer mt-6 text-white/80 w-full px-3 py-2 hover:bg-white/30 hover:text-white/90 bg-white/20 border border-white/30 shadow-md rounded-4xl transition-all"
            >
              Close
            </button>
          </>
        )}
      </div>
    </main>
  );
}
