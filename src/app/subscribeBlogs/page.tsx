import React from "react";
import { fetchSubscribeBlogs } from "../../../lib/api";
import SubscribeBlogsDefaultPage from "@/components/subscribe-blogs/subscribeBlogsDefaultPage";

export default async function SubscribeBlogs() {
  const subscribeBlogs = await fetchSubscribeBlogs();

  console.log("subscribelBlogs:", subscribeBlogs);
  return <SubscribeBlogsDefaultPage subscribeBlogs={subscribeBlogs} />;
}
