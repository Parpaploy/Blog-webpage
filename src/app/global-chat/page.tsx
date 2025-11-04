import React from "react";
import { cookies } from "next/headers";
import { fetchUser } from "../../../lib/api";
import { IUser } from "../../../interfaces/strapi.interface";
import GlobalChatDefaultPage from "./global-chat-page-default";

export default async function GlobalChatPage() {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get("user")?.value;
  const initialUser: IUser | null = userCookie ? JSON.parse(userCookie) : null;

  const fetchedUser: IUser | null = await fetchUser();

  const userToShow = fetchedUser || initialUser;

  const token = cookieStore.get("token")?.value;

  return <GlobalChatDefaultPage user={userToShow} token={token} />;
}
