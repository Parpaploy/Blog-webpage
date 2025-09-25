"use client";
import React from "react";
import { IBlogs } from "../../../interfaces/strapi.interface";
import BlogCard from "./blog-card";

export default function BlogsDefaultPage({ blogs }: { blogs: IBlogs[] }) {
  console.log(blogs);
  return (
    <main className="w-full min-h-screen">
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
