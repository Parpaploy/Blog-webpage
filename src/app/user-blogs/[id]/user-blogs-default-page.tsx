"use client";

import React, { useEffect } from "react";
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

export default function UserBlogsDefaultPage({
  user,
  userBlogs,
  userSubscribeBlogs,
}: {
  user: IUser | null;
  userBlogs: IBlog[];
  userSubscribeBlogs: ISubscribeBlog[];
}) {
  const { t } = useTranslation("userBlogs");

  const { isSidebar } = useSidebar();

  const router = useRouter();

  // console.log(user?.id, ":user id");
  // console.log(userBlogs[0]?.author.id, ":user blog id");

  return (
    <main
      className={`w-full h-full overflow-y-auto 2xl:pt-[7svh] xl:pt-[9svh] lg:pt-[8svh] md:pt-[6svh] text-white/80 ${
        isSidebar ? "pl-65" : "pl-25"
      } transition-all pb-3`}
    >
      <div className="mb-5">
        <div
          onClick={() => {
            router.push("/blogs");
          }}
          className="cursor-pointer text-2xl font-bold"
        >
          {t("blog_title", {
            username: userBlogs[0]?.author.username
              ? userBlogs[0].author.username
              : t("no_username"),
          })}
        </div>

        {userBlogs && userBlogs.length > 0 ? (
          <section className="w-full h-auto overflow-y-auto py-3 scrollbar-hide">
            <div className="inline-flex min-w-full gap-5 items-center justify-start overflow-x-auto">
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
          {t("subscribe_blog_title", {
            username: userSubscribeBlogs[0]?.author.username
              ? userSubscribeBlogs[0].author.username
              : t("no_username"),
          })}
        </div>

        {userSubscribeBlogs && userSubscribeBlogs.length > 0 ? (
          <section className="w-full h-auto overflow-y-auto py-3 scrollbar-hide">
            <div className="inline-flex min-w-full gap-5 items-center justify-start overflow-x-auto">
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
      </div>
    </main>
  );
}
