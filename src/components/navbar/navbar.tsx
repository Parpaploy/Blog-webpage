import { cookies } from "next/headers";
import { IUser } from "../../../interfaces/strapi.interface";
import { Logout } from "../../../lib/auth";
import NavbarDefault from "./navbar-default";
import {
  fetchBlogs,
  fetchCategories,
  fetchSubscribeBlogs,
  fetchUser,
} from "../../../lib/api";

export default async function Navbar() {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get("user")?.value;
  const initialUser: IUser | null = userCookie ? JSON.parse(userCookie) : null;

  const fetchedUser: IUser | null = await fetchUser();

  const userToShow = fetchedUser || initialUser;
  const isLoggedIn = userToShow !== null;

  const categories = await fetchCategories();

  const blogs = await fetchBlogs();
  const subscribeBlogs = await fetchSubscribeBlogs();

  // console.log(userToShow, ":navbar user");

  return (
    <NavbarDefault
      isLoggedIn={isLoggedIn}
      user={userToShow}
      Logout={Logout}
      categories={categories}
      blogs={blogs}
      subscribeBlogs={subscribeBlogs}
    />
  );
}
