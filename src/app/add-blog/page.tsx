// pages/admin/add-blog/template-page.tsx
import React from "react";
import AddBlogDefaultPage from "./add-blog-default-page";
import { cookies } from "next/headers";
import { IUser } from "../../../interfaces/strapi.interface";
import { fetchCategories, fetchUser } from "../../../lib/api";

export default async function TemplatePage() {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get("user")?.value;
  const initialUser: IUser | null = userCookie ? JSON.parse(userCookie) : null;

  const fetchedUser: IUser | null = await fetchUser();

  const userToShow = fetchedUser || initialUser;

  const categories = await fetchCategories();

  return <AddBlogDefaultPage user={userToShow} categories={categories} />;
}
