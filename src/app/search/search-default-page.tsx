"use client";

import React, { useEffect, useState } from "react";
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
import { useSearchParams } from "next/navigation";
import GlobalLoading from "../loading";
import AddButton from "@/components/add-btn";

export default function SearchDefaultPage({
  blogs,
  subscribeBlogs,
  user,
}: {
  blogs: IBlog[];
  subscribeBlogs: ISubscribeBlog[];
  user: IUser | null;
}) {
  const { t } = useTranslation("search");
  const { isSidebar } = useSidebar();
  const params = useSearchParams();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  //const [filteredBlogs, setFilteredBlogs] = useState<any[]>([]);

  // const query = params.get("query")?.toLowerCase() || "";
  const selectedCategories = params.getAll("category");

  const query = params.get("query") || "";
  const queryLower = query.toLowerCase();

  const allBlogs = [
    ...blogs.map((blog) => ({ ...blog, type: "blog" })),
    ...subscribeBlogs.map((subBlog) => ({ ...subBlog, type: "subscribe" })),
  ];

  const [filteredBlogs, setFilteredBlogs] = useState<any[]>(allBlogs);

  useEffect(() => {
    setIsLoading(true);

    const timer = setTimeout(() => {
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

      setFilteredBlogs(filtered);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [params.toString()]);

  if (isLoading) {
    return <GlobalLoading />;
  } else {
    return (
      <main
        className={`w-screen h-full overflow-y-auto 2xl:pt-[7svh] xl:pt-[9svh] lg:pt-[8svh] md:pt-[6svh] text-white/80 ${
          isSidebar ? "pl-65" : "pl-25"
        } transition-all scrollbar-hide relative`}
      >
        {filteredBlogs && filteredBlogs.length > 0 ? (
          <section className="w-full lg:px-10 lg:pt-5 md:px-0 md:pt-5 pb-3">
            <div className="flex flex-wrap gap-5 items-center justify-center">
              {filteredBlogs.map((item: any) =>
                item.type === "blog" ? (
                  <BlogCard
                    key={item.id}
                    blog={item}
                    user={user}
                    query={query}
                    selectedCategories={selectedCategories}
                  />
                ) : (
                  <SubscribeBlogCard
                    key={item.id}
                    subBlog={item}
                    user={user}
                    query={query}
                    selectedCategories={selectedCategories}
                  />
                )
              )}
            </div>
          </section>
        ) : (
          <section className="text-center w-full h-full flex items-center justify-center">
            No Blogs found
          </section>
        )}

        <AddButton />
      </main>
    );
  }
}
