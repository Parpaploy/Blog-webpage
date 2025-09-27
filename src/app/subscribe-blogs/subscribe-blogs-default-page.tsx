"use client";

import React from "react";
import { ISubscribeBlog, IUser } from "../../../interfaces/strapi.interface";
import SubscribeBlogCard from "../../components/subscribe-blogs/subscribe-blog-card";
import { useTranslation } from "react-i18next";

export default function SubscribeBlogsDefaultPage({
  subscribeBlogs,
}: {
  subscribeBlogs: ISubscribeBlog[];
}) {
  const { t } = useTranslation("subscribeBlogs");

  return (
    <main className="w-full min-h-[91svh] max-w-[1920px] mx-auto">
      {subscribeBlogs && subscribeBlogs.length > 0 ? (
        <section className="w-full h-full p-10">
          <div className="flex flex-wrap gap-5 items-center justify-center">
            {subscribeBlogs.map((subBlog, index: number) => (
              <SubscribeBlogCard key={subBlog.id} subBlog={subBlog} />
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
