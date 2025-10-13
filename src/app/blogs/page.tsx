import React from "react";
import { fetchBlogs, fetchUser } from "../../../lib/api";
import BlogsDefaultPage from "./blogs-default-page";
import { IBlog, IUser } from "../../../interfaces/strapi.interface";
import { cookies } from "next/headers";

export default async function Blogs() {
  const blogs: IBlog[] = await fetchBlogs();

  const cookieStore = await cookies();
  const userCookie = cookieStore.get("user")?.value;
  const initialUser: IUser | null = userCookie ? JSON.parse(userCookie) : null;

  const fetchedUser: IUser | null = await fetchUser();

  const userToShow = fetchedUser || initialUser;

  return <BlogsDefaultPage blogs={blogs} user={userToShow} />;
}
