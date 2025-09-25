import React from "react";
import { ISubscribeBlogs } from "../../../interfaces/strapi.interface";

export default function SubscribeBlogCard({
  subBlog,
}: {
  subBlog: ISubscribeBlogs;
}) {
  return (
    <div className="border p-4 mb-2">
      <h2>{subBlog.title}</h2>
      <p>{subBlog.description}</p>
    </div>
  );
}
