import React from "react";
import {
  fetchBlogs,
  fetchBlogsByID,
  fetchBlogsUserByID,
  fetchUser,
} from "../../../../lib/api";
import BlogDetailPage from "./blog-detail-page";
import { IBlog, IUser } from "../../../../interfaces/strapi.interface";
import { cookies } from "next/headers";

export default async function BlogDetail({ params }: any) {
  const { id } = await params;

  const blog: IBlog = await fetchBlogsByID(id);
  const blogs: IBlog[] = await fetchBlogs();
  const blogUser: IBlog = await fetchBlogsUserByID(id);

  const cookieStore = await cookies();
  const userCookie = cookieStore.get("user")?.value;
  const initialUser: IUser | null = userCookie ? JSON.parse(userCookie) : null;

  const fetchedUser: IUser | null = await fetchUser();

  const userToShow = fetchedUser || initialUser;

  return (
    <BlogDetailPage
      blog={blog}
      blogs={blogs}
      blogUser={blogUser}
      user={userToShow}
    />
  );
}
