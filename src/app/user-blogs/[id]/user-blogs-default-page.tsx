"use client";

import React from "react";
import {
  IBlog,
  ISubscribeBlog,
  IUser,
} from "../../../../interfaces/strapi.interface";
import { useTranslation } from "react-i18next";
import { useSidebar } from "../../../../hooks/sidebar";
import BlogCard from "../../../components/blogs/blog-card";
import SubscribeBlogCard from "@/components/subscribe-blogs/subscribe-blog-card";
import { useRouter } from "next/navigation";
import AddButton from "@/components/add-btn";

export default function UserBlogsDefaultPage({
  user,
  userBlogs,
  userSubscribeBlogs,
  token,
}: {
  user: IUser | null;
  userBlogs: IBlog[];
  userSubscribeBlogs: ISubscribeBlog[];
  token: string | undefined;
}) {
  const { t } = useTranslation("userBlogs");

  const { isSidebar } = useSidebar();

  const router = useRouter();

  return (
    <main
      className={`w-screen h-full overflow-y-auto 2xl:pt-[7svh] xl:pt-[9svh] lg:pt-[8svh] md:pt-[6svh] pt-[2svh] text-white/80 scrollbar-hide ${
        isSidebar ? "md:pl-65 pl-3" : "md:pl-25 pl-3"
      } transition-all duration-300 relative md:pb-0 pb-17`}
    >
      <div
        onClick={() => {
          router.push("/blogs");
        }}
        className="cursor-pointer text-2xl font-bold"
      >
        {t("blog_title", {
          username: userBlogs[0]?.author.username
            ? userBlogs[0].author.username
            : userSubscribeBlogs[0]?.author.username
            ? userSubscribeBlogs[0]?.author.username
            : t("no_username"),
        })}
      </div>

      {userBlogs && userBlogs.length > 0 ? (
        <section className="w-full h-auto overflow-y-auto py-3 scrollbar-hide">
          <div className="inline-flex min-w-full md:gap-5 gap-3 items-center justify-start overflow-x-auto pb-3">
            {userBlogs.map((blog, index: number) => (
              <BlogCard key={blog.id} blog={blog} user={user} />
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
        {t("subscribe_blog_title", {
          username: userSubscribeBlogs[0]?.author.username
            ? userSubscribeBlogs[0].author.username
            : userBlogs[0]?.author.username
            ? userBlogs[0]?.author.username
            : t("no_username"),
        })}
      </div>

      {userSubscribeBlogs && userSubscribeBlogs.length > 0 ? (
        <section className="w-full h-auto overflow-y-auto pt-3 scrollbar-hide">
          <div className="inline-flex min-w-full md:gap-5 gap-3 items-center justify-start overflow-x-auto pb-3">
            {userSubscribeBlogs.map((subBlog, index: number) => (
              <SubscribeBlogCard
                key={subBlog.id}
                subBlog={subBlog}
                user={user}
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

      <AddButton />
    </main>
  );
}
