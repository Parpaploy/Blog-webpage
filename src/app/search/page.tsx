import React from "react";
import { ISubscribeBlog, IUser } from "../../../interfaces/strapi.interface";
import { fetchBlogs, fetchSubscribeBlogs, fetchUser } from "../../../lib/api";
import { cookies } from "next/headers";
import SearchDefaultPage from "./search-default-page";

export default async function SearchPage() {
  const blogs: ISubscribeBlog[] = await fetchBlogs();
  const subscribeBlogs: ISubscribeBlog[] = await fetchSubscribeBlogs();

  const cookieStore = await cookies();
  const userCookie = cookieStore.get("user")?.value;
  const initialUser: IUser | null = userCookie ? JSON.parse(userCookie) : null;

  const fetchedUser: IUser | null = await fetchUser();

  const userToShow = fetchedUser || initialUser;

  const token = cookieStore.get("token")?.value;

  return (
    <SearchDefaultPage
      blogs={blogs}
      subscribeBlogs={subscribeBlogs}
      user={userToShow}
      token={token}
    />
  );
}
