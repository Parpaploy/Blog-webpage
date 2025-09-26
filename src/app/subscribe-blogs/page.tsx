import React from "react";
import { headers } from "next/headers";
import { fetchSubscribeBlogs } from "../../../lib/api";
import { ISubscribeBlog, IUser } from "../../../interfaces/strapi.interface";
import SubscribeBlogsDefaultPage from "./subscribe-blogs-default-page";

export default async function SubscribeBlogs() {
  const subscribeBlogs: ISubscribeBlog[] = await fetchSubscribeBlogs();
  const headerList = headers();
  const users: IUser = JSON.parse((await headerList).get("users") as string);

  // console.log("subscribelBlogs:", subscribeBlogs);
  return (
    <SubscribeBlogsDefaultPage subscribeBlogs={subscribeBlogs} users={users} />
  );
}
