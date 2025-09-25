import React from "react";
import { headers } from "next/headers";
import { fetchSubscribeBlogs } from "../../../lib/api";
import SubscribeBlogsDefaultPage from "@/components/subscribe-blogs/subscribe-blogs-default-page";
import { ISubscribeBlogs, IUser } from "../../../interfaces/strapi.interface";

export default async function SubscribeBlogs() {
  const subscribeBlogs: ISubscribeBlogs[] = await fetchSubscribeBlogs();
  const headerList = headers();
  const users: IUser = JSON.parse((await headerList).get("users") as string);

  // console.log("subscribelBlogs:", subscribeBlogs);
  return (
    <SubscribeBlogsDefaultPage subscribeBlogs={subscribeBlogs} users={users} />
  );
}
