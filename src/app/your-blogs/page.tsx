import React from "react";
import { fetchBlogs, fetchSubscribeBlogs, fetchUser } from "../../../lib/api";
import {
  IBlog,
  ISubscribeBlog,
  IUser,
} from "../../../interfaces/strapi.interface";
import YourBlogsDefaultPage from "./your-blogs-default-page";
import { cookies } from "next/headers";

export default async function YourBlogs() {
  const blogs: IBlog[] = await fetchBlogs();
  const subBlogs: ISubscribeBlog[] = await fetchSubscribeBlogs();

  const cookieStore = await cookies();
  const userCookie = cookieStore.get("user")?.value;
  const initialUser: IUser | null = userCookie ? JSON.parse(userCookie) : null;

  const fetchedUser: IUser | null = await fetchUser();

  const userToShow = fetchedUser || initialUser;

  return (
    <YourBlogsDefaultPage
      blogs={blogs}
      subscribeBlogs={subBlogs}
      user={userToShow}
    />
  );
}
