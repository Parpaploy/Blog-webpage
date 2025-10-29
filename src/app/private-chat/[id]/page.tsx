import React from "react";
import { cookies } from "next/headers";
import { fetchUser } from "../../../../lib/api";
import { IUser } from "../../../../interfaces/strapi.interface";
import PrivateChatDefaultPage from "./private-chat-page-default";
import { fetchRecipientByDocumentId } from "../../../../lib/chat-api";

export default async function PrivateChatPage({
  params,
}: {
  params: { id: string };
}) {
  const { id: recipientId } = params;

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const userCookie = cookieStore.get("user")?.value;
  const initialUser: IUser | null = userCookie ? JSON.parse(userCookie) : null;
  const fetchedUser: IUser | null = await fetchUser();
  const userToShow = fetchedUser || initialUser;

  if (userToShow && userToShow.documentId === recipientId) {
    return (
      <main className="w-screen h-full flex flex-col items-center justify-center text-white/70 p-5 text-center">
        <h2 className="text-2xl font-bold mb-2">Error</h2>
        <p>You cannot chat with yourself.</p>
      </main>
    );
  }

  const recipientUser: IUser | null = await fetchRecipientByDocumentId(
    recipientId,
    token
  );

  if (!recipientUser) {
    return (
      <main className="w-screen h-full flex flex-col items-center justify-center text-white/70 p-5 text-center">
        <h2 className="text-2xl font-bold mb-2">Error</h2>
        <p>User not found or you may not have permission.</p>
      </main>
    );
  }

  return (
    <PrivateChatDefaultPage
      user={userToShow}
      token={token}
      recipientUser={recipientUser}
    />
  );
}
