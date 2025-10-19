import React from "react";
import {
  fetchSubscribeBlogs,
  fetchSubscribeBlogsByID,
  fetchSubscribeBlogsUserByID,
  fetchUser,
} from "../../../../lib/api";
import BlogDetailPage from "./subscribe-blog-detail-page";
import { ISubscribeBlog, IUser } from "../../../../interfaces/strapi.interface";
import { cookies } from "next/headers";

export default async function BlogDetail({ params }: any) {
  const { id } = await params;

  const subBlog: ISubscribeBlog = await fetchSubscribeBlogsByID(id);
  const subBlogs: ISubscribeBlog[] = await fetchSubscribeBlogs();
  const subBlogUser: ISubscribeBlog = await fetchSubscribeBlogsUserByID(id);

  const cookieStore = await cookies();
  const userCookie = cookieStore.get("user")?.value;
  const initialUser: IUser | null = userCookie ? JSON.parse(userCookie) : null;

  const fetchedUser: IUser | null = await fetchUser();

  const userToShow = fetchedUser || initialUser;

  const token = cookieStore.get("token")?.value;

  return (
    <BlogDetailPage
      subBlog={subBlog}
      subBlogs={subBlogs}
      subBlogUser={subBlogUser}
      user={userToShow}
      token={token}
    />
  );
}
