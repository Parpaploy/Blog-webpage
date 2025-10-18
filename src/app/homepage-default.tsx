"use client";

import React, { useState, useTransition } from "react";
import { useTranslation } from "react-i18next";
import { useSidebar } from "../../hooks/sidebar";
import BlogCard from "@/components/blogs/blog-card";
import {
  IBlog,
  IHighlight,
  ISubscribeBlog,
  IUser,
} from "../../interfaces/strapi.interface";
import SubscribeBlogCard from "@/components/subscribe-blogs/subscribe-blog-card";
import ContinueButton from "@/components/continue-btn";
import AddButton from "@/components/add-btn";
import { useRouter } from "next/navigation";
import DeleteFreeBlogPanel from "@/components/delete-free-blog-panel";
import DeleteSubscribeBlogPanel from "@/components/delete-subscribe-blog-panel";
import {
  deleteFreeBlog,
  deleteSubscribeBlog,
} from "../../lib/apis/blog-uploader";
import GlobalLoading from "./loading";

export default function HomepageDefault({
  user,
  blogs,
  subscribeBlogs,
  highlight,
  token,
}: {
  user: IUser | null;
  blogs: IBlog[];
  subscribeBlogs: ISubscribeBlog[];
  highlight: IHighlight;
  token: string | undefined;
}) {
  // console.log(blogs, ":blogs");
  // console.log(subscribeBlogs, ":subscribe blogs");
  // console.log(highlight, ":Highlight");

  const { t } = useTranslation("home");

  const { isSidebar } = useSidebar();

  const router = useRouter();

  const [isPending, startTransition] = useTransition();

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
    <>
      <main
        className={`${
          isPending ? "w-full" : "w-screen"
        } h-full overflow-y-auto scrollbar-hide text-white/80 2xl:pt-[7svh] xl:pt-[9svh] lg:pt-[8svh] md:pt-[6svh] ${
          isSidebar ? "pl-65" : "pl-25"
        } transition-all relative`}
      >
        {isPending ? (
          <GlobalLoading />
        ) : (
          <>
            <div>
              <div
                onClick={() => {
                  router.push("/blogs");
                }}
                className="w-fit cursor-pointer text-2xl font-bold"
              >
                {t("highlight_blog_title")}
              </div>

              {highlight.blogs && highlight.blogs.length > 0 ? (
                <section className="w-full h-auto overflow-y-auto py-3 scrollbar-hide pr-5">
                  <div className="inline-flex min-w-full gap-5 items-center justify-start overflow-x-auto pb-3">
                    {highlight.blogs.map((blog, index: number) => (
                      <BlogCard
                        key={blog.id}
                        blog={blog}
                        user={user}
                        showDeletePanel={showFreeDeletePanel}
                        setShowDeletePanel={setShowFreeDeletePanel}
                        setSelectedDocumentId={setSelectedFreeDocumentId}
                      />
                    ))}

                    <ContinueButton path="/blogs" />
                  </div>
                </section>
              ) : (
                <section className="text-center w-full h-80 flex items-center justify-center">
                  {t("no_pop_blog_found")}
                </section>
              )}
            </div>

            <div>
              <div
                onClick={() => {
                  if (user !== null) {
                    router.push("/subscribe-blogs");
                  }
                }}
                className="cursor-pointer text-2xl font-bold w-fit"
              >
                {t("highlight_subscribe_blog_title")}
              </div>

              {highlight.subscribe_blogs &&
              highlight.subscribe_blogs.length > 0 ? (
                <section className="w-full h-auto overflow-y-auto py-3 scrollbar-hide overflow-x-auto pr-5">
                  <div className="inline-flex min-w-full gap-5 items-center justify-start pb-3">
                    {highlight.subscribe_blogs.map((subBlog, index: number) => (
                      <SubscribeBlogCard
                        key={subBlog.id}
                        subBlog={subBlog}
                        user={user}
                        showDeletePanel={showSubscribeDeletePanel}
                        setShowDeletePanel={setShowSubscribeDeletePanel}
                        setSelectedDocumentId={setSelectedSubscribeDocumentId}
                      />
                    ))}

                    <ContinueButton path="/subscribe-blogs" />
                  </div>
                </section>
              ) : (
                <section className="text-center w-full h-80 flex items-center justify-center">
                  {t("no_pop_subscribe_blog_found")}
                </section>
              )}
            </div>

            <div>
              <div
                onClick={() => {
                  router.push("/blogs");
                }}
                className="cursor-pointer text-2xl font-bold w-fit"
              >
                {t("blog_title")}
              </div>

              {blogs && blogs.length > 0 ? (
                <section className="w-full h-auto overflow-y-auto py-3 scrollbar-hide pr-5">
                  <div className="inline-flex min-w-full gap-5 items-center justify-start overflow-x-auto pb-3">
                    {blogs.map((blog, index: number) => (
                      <BlogCard
                        key={blog.id}
                        blog={blog}
                        user={user}
                        showDeletePanel={showFreeDeletePanel}
                        setShowDeletePanel={setShowFreeDeletePanel}
                        setSelectedDocumentId={setSelectedFreeDocumentId}
                      />
                    ))}

                    <ContinueButton path="/blogs" />
                  </div>
                </section>
              ) : (
                <section className="text-center w-full h-80 flex items-center justify-center">
                  {t("no_blog_found")}
                </section>
              )}
            </div>

            <div>
              <div
                onClick={() => {
                  if (user !== null) {
                    router.push("/subscribe-blogs");
                  }
                }}
                className="cursor-pointer text-2xl font-bold w-fit"
              >
                {t("subscribe_blog_title")}
              </div>

              {subscribeBlogs && subscribeBlogs.length > 0 ? (
                <section className="w-full h-auto overflow-y-auto py-3 scrollbar-hide overflow-x-auto pr-5">
                  <div className="inline-flex min-w-full gap-5 items-center justify-start">
                    {subscribeBlogs.map((subBlog, index: number) => (
                      <SubscribeBlogCard
                        key={subBlog.id}
                        subBlog={subBlog}
                        user={user}
                        showDeletePanel={showSubscribeDeletePanel}
                        setShowDeletePanel={setShowSubscribeDeletePanel}
                        setSelectedDocumentId={setSelectedSubscribeDocumentId}
                      />
                    ))}

                    <ContinueButton path="/subscribe-blogs" />
                  </div>
                </section>
              ) : (
                <section className="text-center w-full h-80 flex items-center justify-center">
                  {t("no_subscribe_blog_found")}
                </section>
              )}
            </div>

            <AddButton />

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
      </main>
    </>
  );
}
