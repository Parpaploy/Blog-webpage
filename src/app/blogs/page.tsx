import React from "react";
import { fetchBlogs } from "../../../lib/api";
import BlogsDefaultPage from "./blogs-default-page";
import { IBlog } from "../../../interfaces/strapi.interface";

export default async function Blogs() {
  const blogs: IBlog[] = await fetchBlogs();

  return <BlogsDefaultPage blogs={blogs} />;
}
