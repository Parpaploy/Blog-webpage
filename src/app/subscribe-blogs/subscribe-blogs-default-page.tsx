"use client";

import React from "react";
import { ISubscribeBlog, IUser } from "../../../interfaces/strapi.interface";
import SubscribeBlogCard from "../../components/subscribe-blogs/subscribe-blog-card";

export default function SubscribeBlogsDefaultPage({
  subscribeBlogs,
  users,
}: {
  subscribeBlogs: ISubscribeBlog[];
  users: IUser;
}) {
  return (
    <main className="w-full min-h-[93svh] max-w-[1920px] mx-auto">
      <section>
        <h1>Hello, {users.email}</h1>
        {subscribeBlogs.map((subBlog, index: number) => (
          <SubscribeBlogCard key={subBlog.id} subBlog={subBlog} />
        ))}
      </section>
    </main>
  );
}
