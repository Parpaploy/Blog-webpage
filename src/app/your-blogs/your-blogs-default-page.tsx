"use client";

import React from "react";
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

export default function YourBlogsDefaultPage({
  blogs,
  subscribeBlogs,
  user,
}: {
  blogs: IBlog[];
  subscribeBlogs: ISubscribeBlog[];
  user: IUser | null;
}) {
  const { t } = useTranslation("yourBlogs");

  const { isSidebar } = useSidebar();

  const router = useRouter();

  const userBlogs = blogs.filter((blog) => blog.author?.id === user?.id);
  const userSubscribeBlogs = subscribeBlogs.filter(
    (subBlog) => subBlog.author?.id === user?.id
  );

  return (
    <main
      className={`w-screen h-full overflow-y-auto 2xl:pt-[7svh] xl:pt-[9svh] lg:pt-[8svh] md:pt-[6svh] text-white/80 ${
        isSidebar ? "pl-65" : "pl-25"
      } transition-all`}
    >
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
          <div className="inline-flex min-w-full gap-5 items-center justify-start overflow-x-auto pb-3">
            {userBlogs.map((blog, index: number) => (
              <BlogCard key={blog.id} blog={blog} user={user} />
            ))}
          </div>
        </section>
      ) : (
        <section className="text-center w-full h-80 flex items-center justify-center">
          No Blogs found
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
          <div className="inline-flex min-w-full gap-5 items-center justify-start overflow-x-auto pb-3">
            {userSubscribeBlogs.map((subBlog, index: number) => (
              <SubscribeBlogCard
                key={subBlog.id}
                subBlog={subBlog}
                user={user}
              />
            ))}
          </div>
        </section>
      ) : (
        <section className="text-center w-full h-80 flex items-center justify-center">
          No subscribe blogs found
        </section>
      )}
    </main>
  );
}
