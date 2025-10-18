import React from "react";
import { fetchSubscribeBlogs, fetchUser } from "../../../lib/api";
import { ISubscribeBlog, IUser } from "../../../interfaces/strapi.interface";
import SubscribeBlogsDefaultPage from "./subscribe-blogs-default-page";
import { cookies } from "next/headers";

export default async function SubscribeBlogs() {
  const subscribeBlogs: ISubscribeBlog[] = await fetchSubscribeBlogs();
  // console.log("subscribelBlogs:", subscribeBlogs);

  const cookieStore = await cookies();
  const userCookie = cookieStore.get("user")?.value;
  const initialUser: IUser | null = userCookie ? JSON.parse(userCookie) : null;

  const fetchedUser: IUser | null = await fetchUser();

  const userToShow = fetchedUser || initialUser;

  const token = cookieStore.get("token")?.value;

  return (
    <SubscribeBlogsDefaultPage
      subscribeBlogs={subscribeBlogs}
      user={userToShow}
      token={token}
    />
  );
}
