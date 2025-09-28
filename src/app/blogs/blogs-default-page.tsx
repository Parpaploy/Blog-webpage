"use client";

import React from "react";
import { IBlog } from "../../../interfaces/strapi.interface";
import BlogCard from "../../components/blogs/blog-card";
import { useTranslation } from "react-i18next";
import { useSidebar } from "../../../hooks/sidebar";

export default function BlogsDefaultPage({ blogs }: { blogs: IBlog[] }) {
  //console.log(blogs);
  const { t } = useTranslation("blogs");

  const { isSidebar } = useSidebar();

  return (
    <main
      className={`w-full h-full ${
        isSidebar ? "pl-65" : "pl-25"
      } transition-all`}
    >
      <h1 className="text-2xl font-bold">Blogs</h1>

      {blogs && blogs.length > 0 ? (
        <section className="w-full h-full p-10">
          <div className="flex flex-wrap gap-5 items-center justify-center">
            {blogs.map((blog, index: number) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        </section>
      ) : (
        <section className="text-center w-full min-h-screen flex items-center justify-center">
          No Blogs found
        </section>
      )}
    </main>
  );
}
