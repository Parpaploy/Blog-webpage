import React from "react";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { IUser } from "../../../../interfaces/strapi.interface";
import {
  fetchBlogsByDocumentId,
  fetchSubscribeBlogsByDocumentId,
  fetchBlogSetting,
  fetchCategories,
  fetchUser,
} from "../../../../lib/api";
import EditSubscribeBlogDefaultPage from "./edit-subscribe-blog-default-page";

export default async function EditSubscribeBlogPage({ params }: any) {
  const { id } = await params;

  const cookieStore = await cookies();
  const userCookie = cookieStore.get("user")?.value;
  const initialUser: IUser | null = userCookie ? JSON.parse(userCookie) : null;

  const fetchedUser: IUser | null = await fetchUser();
  const userToShow = fetchedUser || initialUser;

  console.log("--- DEBUGGING EDIT PAGE ---");
  console.log("Document ID from params:", id);
  console.log(
    "User found:",
    userToShow ? `ID: ${userToShow.id}` : "No user found"
  );

  if (!userToShow) {
    notFound();
  }

  const categories = await fetchCategories();
  const token = cookieStore.get("token")?.value;
  const blogSetting = await fetchBlogSetting();

  let initialBlogData = await fetchSubscribeBlogsByDocumentId(id);

  if (!initialBlogData) {
    initialBlogData = await fetchBlogsByDocumentId(id);
  }

  if (!initialBlogData) {
    console.log("Blog not found:", id);
    notFound();
  }

  const authorId =
    initialBlogData.author?.data?.id || initialBlogData.author?.id;

  if (authorId !== userToShow.id) {
    console.log("Not blog owner:", { authorId, userId: userToShow.id });
    notFound();
  }

  return (
    <EditSubscribeBlogDefaultPage
      user={userToShow}
      categories={categories}
      token={token}
      blogSetting={blogSetting}
      initialBlogData={initialBlogData}
    />
  );
}
