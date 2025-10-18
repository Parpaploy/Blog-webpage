"use client";

import React, { useEffect, useState, useTransition } from "react";
import { useSidebar } from "../../../hooks/sidebar";
import { useTranslation } from "react-i18next";
import {
  IBlog,
  ICategory,
  ISubscribeBlog,
  IUser,
} from "../../../interfaces/strapi.interface";
import BlogCard from "@/components/blogs/blog-card";
import SubscribeBlogCard from "@/components/subscribe-blogs/subscribe-blog-card";
import { useRouter, useSearchParams } from "next/navigation";
import GlobalLoading from "../loading";
import AddButton from "@/components/add-btn";
import {
  deleteFreeBlog,
  deleteSubscribeBlog,
} from "../../../lib/apis/blog-uploader";
import DeleteSubscribeBlogPanel from "@/components/delete-subscribe-blog-panel";
import DeleteFreeBlogPanel from "@/components/delete-free-blog-panel";
import { TFunction } from "i18next";
import { BlogEntry } from "../../../types/logic.type";

export default function SearchDefaultPage({
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
  const { t } = useTranslation(["search", "blogs", "subscribeBlogs"]);

  const { isSidebar } = useSidebar();

  const router = useRouter();

  const params = useSearchParams();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const selectedCategories = params.getAll("category");

  const query = params.get("query") || "";
  const queryLower = query.toLowerCase();

  const allBlogs: BlogEntry[] = [
    ...blogs.map((blog) => ({
      ...blog,
      type: "blog" as const,
      sortPrice: 0,
    })),

    ...subscribeBlogs.map((subBlog) => ({
      ...subBlog,
      type: "subscribe" as const,
      sortPrice: parseFloat(subBlog.price) || 0,
    })),
  ];

  const [filteredBlogs, setFilteredBlogs] = useState<BlogEntry[]>(allBlogs);

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
    setFilteredBlogs((prev) =>
      prev.filter((item) => item.documentId !== selectedFreeDocumentId)
    );

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
    setFilteredBlogs((prev) =>
      prev.filter((item) => item.documentId !== selectedSubscribeDocumentId)
    );

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

  useEffect(() => {
    setIsLoading(true);

    const timer = setTimeout(() => {
      const sortBy = params.get("sortBy") || "latest";

      const filtered = allBlogs.filter((item) => {
        const matchQuery =
          !queryLower ||
          item.title?.toLowerCase().includes(queryLower) ||
          item.description?.toLowerCase().includes(queryLower) ||
          item.author?.username?.toLowerCase().includes(queryLower);

        const matchCategory =
          selectedCategories.length === 0 ||
          selectedCategories.every((selectedCat) =>
            item.categories?.some((cat: ICategory) => cat.title === selectedCat)
          );

        return matchQuery && matchCategory;
      });

      const sorted = filtered.sort((a, b) => {
        switch (sortBy) {
          case "alphabetical":
            return a.title.localeCompare(b.title);

          case "price":
            return b.sortPrice - a.sortPrice;

          case "latest":
          default:
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
        }
      });

      setFilteredBlogs(sorted);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [params.toString()]);

  if (isLoading) {
    return <GlobalLoading />;
  } else {
    return (
      <main
        className={`${
          isPending ? "w-full" : "w-screen"
        } h-full overflow-y-auto 2xl:pt-[7svh] xl:pt-[9svh] lg:pt-[8svh] md:pt-[6svh] text-white/80 ${
          isSidebar ? "pl-65" : "pl-25"
        } transition-all scrollbar-hide relative`}
      >
        {isPending ? (
          <GlobalLoading />
        ) : (
          <>
            {filteredBlogs && filteredBlogs.length > 0 ? (
              <section className="w-full lg:px-10 lg:pt-5 md:px-0 md:pt-5 pb-3">
                <div className="flex flex-wrap gap-5 items-center justify-center">
                  {filteredBlogs.map((item: BlogEntry) =>
                    item.type === "blog" ? (
                      <BlogCard
                        key={item.id}
                        blog={item}
                        user={user}
                        query={query}
                        selectedCategories={selectedCategories}
                        showDeletePanel={showFreeDeletePanel}
                        setShowDeletePanel={setShowFreeDeletePanel}
                        setSelectedDocumentId={setSelectedFreeDocumentId}
                      />
                    ) : (
                      <SubscribeBlogCard
                        key={item.id}
                        subBlog={item}
                        user={user}
                        query={query}
                        selectedCategories={selectedCategories}
                        showDeletePanel={showSubscribeDeletePanel}
                        setShowDeletePanel={setShowSubscribeDeletePanel}
                        setSelectedDocumentId={setSelectedSubscribeDocumentId}
                      />
                    )
                  )}
                </div>
              </section>
            ) : (
              <section className="text-center w-full h-full flex items-center justify-center">
                {t("no_blog_found")}
              </section>
            )}

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
    );
  }
}
