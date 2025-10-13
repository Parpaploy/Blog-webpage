"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { useSidebar } from "../../hooks/sidebar";
import BlogCard from "@/components/blogs/blog-card";
import {
  IBlog,
  ISubscribeBlog,
  IUser,
} from "../../interfaces/strapi.interface";
import SubscribeBlogCard from "@/components/subscribe-blogs/subscribe-blog-card";
import ContinueButton from "@/components/continue-btn";
import AddButton from "@/components/add-btn";
import { useRouter } from "next/navigation";

export default function HomepageDefault({
  user,
  blogs,
  subscribeBlogs,
}: {
  user: IUser | null;
  blogs: IBlog[];
  subscribeBlogs: ISubscribeBlog[];
}) {
  // console.log(blogs, ":blogs");
  // console.log(subscribeBlogs, ":subscribe blogs");

  const { t } = useTranslation("home");

  const { isSidebar } = useSidebar();

  const router = useRouter();

  return (
    <main
      className={`w-full h-full overflow-y-auto scrollbar-hide text-white/80 2xl:pt-[7svh] xl:pt-[9svh] lg:pt-[8svh] md:pt-[6svh] ${
        isSidebar ? "pl-65" : "pl-25"
      } transition-all relative`}
    >
      <div className="mb-5">
        <div
          onClick={() => {
            router.push("/blogs");
          }}
          className="cursor-pointer text-2xl font-bold"
        >
          {t("blog_title")}
        </div>

        {blogs && blogs.length > 0 ? (
          <section className="w-full h-auto overflow-y-auto py-3 scrollbar-hide">
            <div className="inline-flex min-w-full gap-5 items-center justify-start overflow-x-auto">
              {blogs.map((blog, index: number) => (
                <BlogCard key={blog.id} blog={blog} user={user} />
              ))}

              <ContinueButton path="/blogs" />
            </div>
          </section>
        ) : (
          <section className="text-center w-full h-80 flex items-center justify-center">
            No Blogs found
          </section>
        )}
      </div>

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
        <section className="w-full h-auto overflow-y-auto py-3 scrollbar-hide overflow-x-auto">
          <div className="inline-flex min-w-full gap-5 items-center justify-start">
            {subscribeBlogs.map((subBlog, index: number) => (
              <SubscribeBlogCard
                key={subBlog.id}
                subBlog={subBlog}
                user={user}
              />
            ))}

            <ContinueButton path="/subscribe-blogs" />
          </div>
        </section>
      ) : (
        <section className="text-center w-full h-80 flex items-center justify-center">
          No Subscribe blogs found
        </section>
      )}

      <AddButton />
    </main>
  );
}
