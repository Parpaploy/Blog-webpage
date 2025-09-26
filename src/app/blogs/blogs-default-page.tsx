"use client";

import React from "react";
import { IBlog } from "../../../interfaces/strapi.interface";
import BlogCard from "../../components/blogs/blog-card";

export default function BlogsDefaultPage({ blogs }: { blogs: IBlog[] }) {
  //console.log(blogs);

  return (
    <main className="w-full min-h-[93svh] max-w-[1920px] mx-auto">
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
