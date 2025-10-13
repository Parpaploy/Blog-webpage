import { cookies } from "next/headers";
import { fetchBlogs, fetchSubscribeBlogs, fetchUser } from "../../lib/api";
import HomepageDefault from "./homepage-default";
import { IUser } from "../../interfaces/strapi.interface";

export default async function Homepage() {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get("user")?.value;
  const initialUser: IUser | null = userCookie ? JSON.parse(userCookie) : null;

  const fetchedUser: IUser | null = await fetchUser();

  const userToShow = fetchedUser || initialUser;

  const blogs = await fetchBlogs();
  const subscribeBlogs = await fetchSubscribeBlogs();

  return (
    <HomepageDefault
      user={userToShow}
      blogs={blogs}
      subscribeBlogs={subscribeBlogs}
    />
  );
}
