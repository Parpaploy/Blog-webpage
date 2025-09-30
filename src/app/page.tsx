import { fetchBlogs, fetchSubscribeBlogs } from "../../lib/api";
import HomepageDefault from "./homepage-default";

export default async function Homepage() {
  const blogs = await fetchBlogs();
  const subscribeBlogs = await fetchSubscribeBlogs();

  return <HomepageDefault blogs={blogs} subscribeBlogs={subscribeBlogs} />;
}
