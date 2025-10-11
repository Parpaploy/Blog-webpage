"use client";

import React from "react";
import {
  IBlog,
  ISubscribeBlog,
  IUser,
} from "../../../interfaces/strapi.interface";
import BlogCard from "../../components/blogs/blog-card";
import SubscribeBlogCard from "../../components/subscribe-blogs/small-subscribe-blog-card";
import { useTranslation } from "react-i18next";
import { useSidebar } from "../../../hooks/sidebar";

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

  const allBlogs: (IBlog | ISubscribeBlog)[] = [...blogs, ...subscribeBlogs];

  const userBlogs = blogs.filter((blog) => blog.author?.id === user?.id);
  const userSubscribeBlogs = subscribeBlogs.filter(
    (subBlog) => subBlog.author?.id === user?.id
  );

  return (
    <main
      className={`w-full h-full overflow-y-auto 2xl:pt-[7svh] xl:pt-[9svh] lg:pt-[8svh] md:pt-[5svh] text-white/80 ${
        isSidebar ? "pl-65" : "pl-25"
      } transition-all pb-3`}
    >
      <h1 className="text-2xl font-bold mb-5">{t("title")}</h1>

      {userBlogs.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">{t("yourBlogs")}</h2>
          <div className="flex flex-wrap gap-5">
            {userBlogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        </section>
      )}

      {userSubscribeBlogs.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-3">
            {t("yourSubscribeBlogs")}
          </h2>
          <div className="flex flex-wrap gap-5">
            {userSubscribeBlogs.map((subBlog) => (
              <SubscribeBlogCard key={subBlog.id} subBlog={subBlog} />
            ))}
          </div>
        </section>
      )}

      {userBlogs.length === 0 && userSubscribeBlogs.length === 0 && (
        <section className="text-center w-full min-h-screen flex items-center justify-center">
          {t("noBlogsFound")}
        </section>
      )}
    </main>
  );
}
