"use client";

import React, { useState, useTransition } from "react";
import { ISubscribeBlog, IUser } from "../../../interfaces/strapi.interface";
import SubscribeBlogCard from "../../components/subscribe-blogs/subscribe-blog-card";
import { useTranslation } from "react-i18next";
import { useSidebar } from "../../../hooks/sidebar";
import AddButton from "@/components/add-btn";
import DeleteSubscribeBlogPanel from "@/components/delete-subscribe-blog-panel";
import { deleteSubscribeBlog } from "../../../lib/apis/blog-uploader";
import { useRouter } from "next/navigation";
import GlobalLoading from "../loading";
import Loading from "./loading";

export default function SubscribeBlogsDefaultPage({
  subscribeBlogs,
  user,
  token,
}: {
  subscribeBlogs: ISubscribeBlog[];
  user: IUser | null;
  token: string | undefined;
}) {
  const { t } = useTranslation("subscribeBlogs");

  const { isSidebar } = useSidebar();

  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const [showDeletePanel, setShowDeletePanel] = useState<boolean>(false);
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(
    null
  );

  const [deleteStatus, setDeleteStatus] = useState<
    "confirm" | "deleting" | "success" | "error"
  >("confirm");

  const [deleteError, setDeleteError] = useState<string>("");

  const handleDeleteConfirm = async () => {
    if (!selectedDocumentId || !token) return;

    setDeleteStatus("deleting");

    const result = await deleteSubscribeBlog(selectedDocumentId, token);

    if (result.success) {
      setDeleteStatus("success");
    } else {
      setDeleteStatus("error");
      setDeleteError(result.error || "Failed to delete blog");
    }
  };

  const handleDeleteSuccess = () => {
    startTransition(() => {
      router.refresh();
    });

    setTimeout(() => {
      setShowDeletePanel(false);
      setDeleteStatus("confirm");
      setSelectedDocumentId(null);
      setDeleteError("");
    }, 500);
  };

  const handleDeleteCancel = () => {
    setShowDeletePanel(false);
    setDeleteStatus("confirm");
    setSelectedDocumentId(null);
    setDeleteError("");
  };

  return (
    <main
      className={`${isPending ? "w-full" : "w-screen"} h-full ${
        subscribeBlogs && subscribeBlogs.length > 0
          ? "overflow-y-auto"
          : "overflow-y-hidden"
      } 2xl:pt-[7svh] xl:pt-[9svh] lg:pt-[8svh] md:pt-[6svh] pt-[2svh] text-white/80 ${
        isSidebar ? "md:pl-65" : "md:pl-25"
      } transition-all scrollbar-hide relative md:pb-0 pb-18`}
    >
      <h1 className="text-2xl font-bold md:ml-0 ml-3">{t("title")}</h1>

      <div
        className={`w-full md:h-full pr-25 ${
          !subscribeBlogs || (subscribeBlogs.length <= 0 && "pb-11")
        }`}
      >
        {subscribeBlogs && subscribeBlogs.length > 0 ? (
          <section className="md:w-full w-screen lg:px-10 lg:pt-5 md:px-0 md:pt-5 pb-3">
            <div className="flex flex-wrap gap-5 items-center justify-center">
              {subscribeBlogs.map((subBlog, index: number) => (
                <SubscribeBlogCard
                  key={subBlog.id}
                  subBlog={subBlog}
                  user={user}
                  showDeletePanel={showDeletePanel}
                  setShowDeletePanel={setShowDeletePanel}
                  setSelectedDocumentId={setSelectedDocumentId}
                />
              ))}
            </div>
          </section>
        ) : (
          <section className="text-center w-full h-full flex items-center justify-center">
            {t("no_blog_found")}
          </section>
        )}
      </div>

      <AddButton />

      {showDeletePanel && (
        <DeleteSubscribeBlogPanel
          onCancel={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
          status={deleteStatus}
          error={deleteError}
          onSuccess={handleDeleteSuccess}
          isRefreshing={isPending}
        />
      )}
    </main>
  );
}
