import React from "react";
import {
  fetchSubscribeBlogs,
  fetchSubscribeBlogsByID,
  fetchSubscribeBlogsUserByID,
} from "../../../../lib/api";
import BlogDetailPage from "./subscribe-blog-detail-page";
import { ISubscribeBlog } from "../../../../interfaces/strapi.interface";

export default async function BlogDetail({ params }: any) {
  const { id } = await params;

  const subBlog: ISubscribeBlog = await fetchSubscribeBlogsByID(id);
  const subBlogs: ISubscribeBlog[] = await fetchSubscribeBlogs();
  const subBlogUser: ISubscribeBlog = await fetchSubscribeBlogsUserByID(id);

  return (
    <BlogDetailPage
      subBlog={subBlog}
      subBlogs={subBlogs}
      subBlogUser={subBlogUser}
    />
  );
}
