import BlogsDefaultPage from "@/app/blogs/blogs-default-page";
import { fetchBlogs } from "../../lib/api";

export default async function Homepage() {
  const blogs = await fetchBlogs();
  return <BlogsDefaultPage blogs={blogs} />;
}
