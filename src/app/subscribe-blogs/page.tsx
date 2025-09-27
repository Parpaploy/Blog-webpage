import React from "react";
import { fetchSubscribeBlogs } from "../../../lib/api";
import { ISubscribeBlog, IUser } from "../../../interfaces/strapi.interface";
import SubscribeBlogsDefaultPage from "./subscribe-blogs-default-page";

export default async function SubscribeBlogs() {
  const subscribeBlogs: ISubscribeBlog[] = await fetchSubscribeBlogs();

  // console.log("subscribelBlogs:", subscribeBlogs);
  return <SubscribeBlogsDefaultPage subscribeBlogs={subscribeBlogs} />;
}
