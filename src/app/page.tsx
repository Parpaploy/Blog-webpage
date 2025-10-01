import { fetchBlogs, fetchSubscribeBlogs, fetchUser } from "../../lib/api";
import HomepageDefault from "./homepage-default";

export default async function Homepage() {
  const user = await fetchUser();
  const blogs = await fetchBlogs();
  const subscribeBlogs = await fetchSubscribeBlogs();

  return (
    <HomepageDefault
      user={user}
      blogs={blogs}
      subscribeBlogs={subscribeBlogs}
    />
  );
}
