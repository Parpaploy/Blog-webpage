"use client";
import React from "react";

export default function SubscribeBlogsDefaultPage({
  subscribeBlogs,
}: {
  subscribeBlogs: any;
}) {
  return (
    <main>
      <section>
        {subscribeBlogs.map((subBlog: any, index: number) => (
          <div key={subBlog.id} className="border p-4 mb-2">
            <h2>{subBlog.title || "No Title"}</h2>
            <p>{subBlog.description}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
