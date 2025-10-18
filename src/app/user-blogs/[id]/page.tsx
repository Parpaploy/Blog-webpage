import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import {
  fetchUser,
  fetchBlogs,
  fetchSubscribeBlogs,
} from "../../../../lib/api";
import UserBlogsDefaultPage from "./user-blogs-default-page";
import { IBlog, ISubscribeBlog } from "../../../../interfaces/strapi.interface";

export default async function UserBlogs({ params }: any) {
  const { id } = await params;

  const cookieStore = await cookies();
  const userCookie = cookieStore.get("user")?.value;
  const initialUser = userCookie ? JSON.parse(userCookie) : null;

  const fetchedUser = await fetchUser();
  const userToShow = fetchedUser || initialUser;

  if (userToShow?.id.toString() === id) {
    return redirect("/your-blogs");
  }

  const allBlogs = await fetchBlogs();
  const allSubscribeBlogs = await fetchSubscribeBlogs();

  const userBlogs = allBlogs.filter(
    (blog: IBlog) => blog.author?.id.toString() === id
  );
  const userSubscribeBlogs = allSubscribeBlogs.filter(
    (sub: ISubscribeBlog) => sub.author?.id.toString() === id
  );

  const token = cookieStore.get("token")?.value;

  return (
    <UserBlogsDefaultPage
      userBlogs={userBlogs}
      userSubscribeBlogs={userSubscribeBlogs}
      user={userToShow}
      token={token}
    />
  );
}
