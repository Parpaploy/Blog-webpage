"use client";

import React from "react";
import { ISubscribeBlog, IUser } from "../../../interfaces/strapi.interface";
import SubscribeBlogCard from "../../components/subscribe-blogs/subscribe-blog-card";
import { useTranslation } from "react-i18next";
import { useSidebar } from "../../../hooks/sidebar";

export default function SubscribeBlogsDefaultPage({
  subscribeBlogs,
  user,
}: {
  subscribeBlogs: ISubscribeBlog[];
  user: IUser | null;
}) {
  const { t } = useTranslation("subscribeBlogs");

  const { isSidebar } = useSidebar();

  return (
    <main
      className={`w-full h-full overflow-y-auto 2xl:pt-[7svh] xl:pt-[9svh] lg:pt-[8svh] md:pt-[6svh] text-white/80 ${
        isSidebar ? "pl-65" : "pl-25"
      } transition-all pb-1.5 scrollbar-hide`}
    >
      <h1 className="text-2xl font-bold">{t("title")}</h1>

      {subscribeBlogs && subscribeBlogs.length > 0 ? (
        <section className="w-full lg:px-10 lg:pt-10 md:px-0 md:pt-10 pb-3">
          <div className="flex flex-wrap gap-5 items-center justify-center">
            {subscribeBlogs.map((subBlog, index: number) => (
              <SubscribeBlogCard
                key={subBlog.id}
                subBlog={subBlog}
                user={user}
              />
            ))}
          </div>
        </section>
      ) : (
        <section className="text-center w-full min-h-screen flex items-center justify-center">
          No Subscribe blogs found
        </section>
      )}
    </main>
  );
}
