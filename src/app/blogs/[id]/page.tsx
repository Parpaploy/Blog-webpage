import React from "react";
import {
  fetchBlogs,
  fetchBlogsByID,
  fetchBlogsUserByID,
} from "../../../../lib/api";
import BlogDetailPage from "./blog-detail-page";
import { IBlog } from "../../../../interfaces/strapi.interface";

export default async function BlogDetail({ params }: any) {
  const { id } = await params;

  const blog: IBlog = await fetchBlogsByID(id);
  const blogs: IBlog[] = await fetchBlogs();
  const blogUser: IBlog = await fetchBlogsUserByID(id);

  return <BlogDetailPage blog={blog} blogs={blogs} blogUser={blogUser} />;
}
