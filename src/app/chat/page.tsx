import React from "react";
import ChatDefaultPage from "./chat-page-default";
import { cookies } from "next/headers";
import { fetchUser } from "../../../lib/api";
import { IUser } from "../../../interfaces/strapi.interface";

async function ChatPage() {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get("user")?.value;
  const initialUser: IUser | null = userCookie ? JSON.parse(userCookie) : null;

  const fetchedUser: IUser | null = await fetchUser();

  const userToShow = fetchedUser || initialUser;

  const token = cookieStore.get("token")?.value;

  return <ChatDefaultPage user={userToShow} token={token} />;
}

export default ChatPage;
