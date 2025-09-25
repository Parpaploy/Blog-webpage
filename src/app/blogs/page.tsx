import React from "react";
import { fetchBlogs } from "../../../lib/api";
import BlogsDefaultPage from "@/components/blogs/blogs-default-page";
import { IBlogs } from "../../../interfaces/strapi.interface";

export default async function Blogs() {
  const blogs: IBlogs[] = await fetchBlogs();

  return <BlogsDefaultPage blogs={blogs} />;
}
