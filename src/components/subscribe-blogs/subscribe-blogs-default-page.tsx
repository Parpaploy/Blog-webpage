"use client";
import React from "react";
import { ISubscribeBlogs, IUser } from "../../../interfaces/strapi.interface";
import SubscribeBlogCard from "./subscribe-blog-card";

export default function SubscribeBlogsDefaultPage({
  subscribeBlogs,
  users,
}: {
  subscribeBlogs: ISubscribeBlogs[];
  users: IUser;
}) {
  return (
    <main>
      <section>
        <h1>Hello, {users.email}</h1>
        {subscribeBlogs.map((subBlog, index: number) => (
          <SubscribeBlogCard key={subBlog.id} subBlog={subBlog} />
        ))}
      </section>
    </main>
  );
}
