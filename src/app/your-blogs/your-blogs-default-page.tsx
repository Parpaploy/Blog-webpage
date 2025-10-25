"use client";

import React, { useState, useTransition } from "react";
import {
  IBlog,
  ISubscribeBlog,
  IUser,
} from "../../../interfaces/strapi.interface";
import { useTranslation } from "react-i18next";
import { useSidebar } from "../../../hooks/sidebar";
import BlogCard from "../../components/blogs/blog-card";
import SubscribeBlogCard from "@/components/subscribe-blogs/subscribe-blog-card";
import { useRouter } from "next/navigation";
import DeleteFreeBlogPanel from "@/components/delete-free-blog-panel";
import DeleteSubscribeBlogPanel from "@/components/delete-subscribe-blog-panel";
import {
  deleteFreeBlog,
  deleteSubscribeBlog,
} from "../../../lib/apis/blog-uploader";
import GlobalLoading from "../loading";
import AddButton from "@/components/add-btn";

export default function YourBlogsDefaultPage({
  blogs,
  subscribeBlogs,
  user,
  token,
}: {
  blogs: IBlog[];
  subscribeBlogs: ISubscribeBlog[];
  user: IUser | null;
  token: string | undefined;
}) {
  const { t } = useTranslation("yourBlogs");

  const { isSidebar } = useSidebar();

  const [isPending, startTransition] = useTransition();

  const router = useRouter();

  const [showFreeDeletePanel, setShowFreeDeletePanel] =
    useState<boolean>(false);
  const [showSubscribeDeletePanel, setShowSubscribeDeletePanel] =
    useState<boolean>(false);

  const [selectedFreeDocumentId, setSelectedFreeDocumentId] = useState<
    string | null
  >(null);
  const [selectedSubscribeDocumentId, setSelectedSubscribeDocumentId] =
    useState<string | null>(null);

  const [freeDeleteStatus, setFreeDeleteStatus] = useState<
    "confirm" | "deleting" | "success" | "error"
  >("confirm");
  const [subscribeDeleteStatus, setSubscribeDeleteStatus] = useState<
    "confirm" | "deleting" | "success" | "error"
  >("confirm");

  const [deleteError, setDeleteError] = useState<string>("");

  const userBlogs = (blogs || []).filter(
    (blog) => blog.author?.id === user?.id
  );
  const userSubscribeBlogs = (subscribeBlogs || []).filter(
    (subBlog) => subBlog.author?.id === user?.id
  );

  const handleDeleteFreeConfirm = async () => {
    if (!selectedFreeDocumentId || !token) return;

    setFreeDeleteStatus("deleting");

    const result = await deleteFreeBlog(selectedFreeDocumentId, token);

    if (result.success) {
      setFreeDeleteStatus("success");
    } else {
      setFreeDeleteStatus("error");
      setDeleteError(result.error || "Failed to delete blog");
    }
  };

  const handleDeleteSubscribeConfirm = async () => {
    if (!selectedSubscribeDocumentId || !token) return;

    setSubscribeDeleteStatus("deleting");

    const result = await deleteSubscribeBlog(
      selectedSubscribeDocumentId,
      token
    );

    if (result.success) {
      setSubscribeDeleteStatus("success");
    } else {
      setSubscribeDeleteStatus("error");
      setDeleteError(result.error || "Failed to delete blog");
    }
  };

  const handleFreeDeleteSuccess = () => {
    startTransition(() => {
      router.refresh();
    });

    setTimeout(() => {
      setShowFreeDeletePanel(false);
      setFreeDeleteStatus("confirm");
      setSelectedFreeDocumentId(null);
      setDeleteError("");
    }, 500);
  };

  const handleSubscribeDeleteSuccess = () => {
    startTransition(() => {
      router.refresh();
    });

    setTimeout(() => {
      setShowSubscribeDeletePanel(false);
      setSubscribeDeleteStatus("confirm");
      setSelectedSubscribeDocumentId(null);
      setDeleteError("");
    }, 500);
  };

  const handleFreeDeleteCancel = () => {
    setShowFreeDeletePanel(false);
    setFreeDeleteStatus("confirm");
    setSelectedFreeDocumentId(null);
    setDeleteError("");
  };

  const handleSubscribeDeleteCancel = () => {
    setShowSubscribeDeletePanel(false);
    setSubscribeDeleteStatus("confirm");
    setSelectedSubscribeDocumentId(null);
    setDeleteError("");
  };

  return (
    <main
      className={`${
        isPending ? "w-full" : "w-screen"
      } h-full overflow-y-auto 2xl:pt-[7svh] xl:pt-[9svh] lg:pt-[8svh] md:pt-[6svh] pt-[2svh] text-white/80 scrollbar-hide ${
        isSidebar ? "md:pl-65 pl-3" : "md:pl-25 pl-3"
      } transition-all relative md:pb-0 pb-18`}
    >
      {isPending ? (
        <GlobalLoading />
      ) : (
        <>
          <div
            onClick={() => {
              router.push("/blogs");
            }}
            className="cursor-pointer text-2xl font-bold"
          >
            {t("blog_title")}
          </div>

          {userBlogs && userBlogs.length > 0 ? (
            <section className="w-full h-auto overflow-y-auto py-3 scrollbar-hide">
              <div className="inline-flex min-w-full md:gap-5 gap-3 items-center justify-start overflow-x-auto pb-3">
                {userBlogs.map((blog, index: number) => (
                  <BlogCard
                    key={blog.id}
                    blog={blog}
                    user={user}
                    showDeletePanel={showFreeDeletePanel}
                    setShowDeletePanel={setShowFreeDeletePanel}
                    setSelectedDocumentId={setSelectedFreeDocumentId}
                  />
                ))}

                <div className="min-w-0.5 max-w-0.5 h-full" />
              </div>
            </section>
          ) : (
            <section className="text-center w-full h-65 flex items-center justify-center md:pr-25">
              {t("no_blog_found")}
            </section>
          )}

          <div
            onClick={() => {
              router.push("/subscribe-blogs");
            }}
            className="cursor-pointer text-2xl font-bold w-fit"
          >
            {t("subscribe_blog_title")}
          </div>

          {userSubscribeBlogs && userSubscribeBlogs.length > 0 ? (
            <section className="w-full h-auto overflow-y-auto pt-3 scrollbar-hide">
              <div className="inline-flex min-w-full md:gap-5 gap-3 items-center justify-start overflow-x-auto pb-3">
                {userSubscribeBlogs.map((subBlog, index: number) => (
                  <SubscribeBlogCard
                    key={subBlog.id}
                    subBlog={subBlog}
                    user={user}
                    showDeletePanel={showSubscribeDeletePanel}
                    setShowDeletePanel={setShowSubscribeDeletePanel}
                    setSelectedDocumentId={setSelectedSubscribeDocumentId}
                  />
                ))}

                <div className="min-w-0.5 max-w-0.5 h-full" />
              </div>
            </section>
          ) : (
            <section className="text-center w-full h-65 flex items-center justify-center md:pr-25">
              {t("no_subscribe_blog_found")}
            </section>
          )}

          {showFreeDeletePanel && (
            <DeleteFreeBlogPanel
              onCancel={handleFreeDeleteCancel}
              onConfirm={handleDeleteFreeConfirm}
              status={freeDeleteStatus}
              error={deleteError}
              onSuccess={handleFreeDeleteSuccess}
              isRefreshing={isPending}
            />
          )}

          {showSubscribeDeletePanel && (
            <DeleteSubscribeBlogPanel
              onCancel={handleSubscribeDeleteCancel}
              onConfirm={handleDeleteSubscribeConfirm}
              status={subscribeDeleteStatus}
              error={deleteError}
              onSuccess={handleSubscribeDeleteSuccess}
              isRefreshing={isPending}
            />
          )}
        </>
      )}

      <AddButton />
    </main>
  );
}
