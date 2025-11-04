"use client";

import { useEffect, useState } from "react";
import { useSocket } from "../../../../lib/socketContext";
import { IMessage, IUser } from "../../../../interfaces/strapi.interface";
import { fetchPrivateMessages } from "../../../../lib/chat-api";
import { useSidebar } from "../../../../hooks/sidebar";
import Chatbox from "@/components/chat/chatbox";
import { useTranslation } from "react-i18next";
import GlobalLoading from "@/app/loading";

export default function PrivateChatDefaultPage({
  user,
  token,
  recipientUser,
}: {
  user: IUser | null;
  token: string | undefined;
  recipientUser: IUser;
}) {
  const { t } = useTranslation("chat");
  const { isSidebar } = useSidebar();
  const socket = useSocket();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadMessages = async () => {
      if (!token || !user?.documentId || !recipientUser?.documentId) {
        console.log("Missing data, cannot fetch messages.");
        setIsLoading(false);
        return;
      }

      try {
        const initialMessages = await fetchPrivateMessages(
          token,
          user.documentId,
          recipientUser.documentId
        );
        setMessages(initialMessages);
      } catch (error) {
        console.error("Failed to load private messages:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadMessages();
  }, [token, user, recipientUser]);

  useEffect(() => {
    if (!socket) return () => {};

    const handleNewMessage = (newMessage: IMessage) => {
      const myDocId = user?.documentId;
      const otherDocId = recipientUser?.documentId;

      const isMyMessage =
        newMessage.author?.documentId === myDocId &&
        newMessage.recipient?.documentId === otherDocId;

      const isTheirMessage =
        newMessage.author?.documentId === otherDocId &&
        newMessage.recipient?.documentId === myDocId;

      if (isMyMessage || isTheirMessage) {
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    socket.on("newMessage", handleNewMessage);
    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, user, recipientUser]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!socket || !currentMessage.trim() || !recipientUser?.documentId) return;

    socket.emit("sendMessage", {
      text: currentMessage,
      recipientDocumentId: recipientUser.documentId,
    });
    setCurrentMessage("");
  };

  if (isLoading) {
    return <GlobalLoading />;
  }

  return (
    <main
      className={`w-screen h-screen 2xl:pt-[7svh] xl:pt-[9svh] lg:pt-[8svh] md:pt-[6svh] pt-[2svh] ${
        isSidebar ? "md:pl-65" : "md:pl-25"
      } transition-all duration-300 md:px-0 px-3 scrollbar-hide md:pb-0 !pb-18`}
    >
      <div className="w-full h-[98.5%] md:pr-25 flex-1 flex flex-col">
        <section className="w-full h-full flex flex-col justify-between items-center space-y-4 text-white/70 mx-auto">
          <div className="w-full h-full flex flex-col justify-start items-center text-white/70 mx-auto scrollbar-hide">
            <div className="bg-white/10 backdrop-blur-sm border border-white/30 shadow-md rounded-4xl px-3 py-1 ">
              <h2 className="font-bold text-xl">{recipientUser.username}</h2>
            </div>

            <div className="h-full flex flex-col pt-10 pb-3 scrollbar-hide overflow-y-auto w-full max-w-2xl">
              {messages.map((msg) => {
                const isMyMessage = msg.author?.documentId === user?.documentId;
                return (
                  <Chatbox
                    key={msg.id}
                    msg={msg}
                    isMyMessage={isMyMessage}
                    profilePic={
                      msg.author.profile?.formats?.small?.url
                        ? `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${msg.author.profile.formats.small.url}`
                        : "https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1906669723.jpg"
                    }
                    isPrivate={true}
                  />
                );
              })}
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex justify-center w-full md:px-4 md:max-w-2xl"
          >
            <input
              type="text"
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              placeholder={t("type")}
              className="md:w-[80%] w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/30 shadow-md rounded-l-4xl focus:ring-2 focus:ring-white/30 focus:outline-none text-white/80 placeholder:text-white/50"
            />
            <button
              type="submit"
              className="px-4 py-2 text-white/80 bg-white/20 backdrop-blur-sm border border-white/30 shadow-md rounded-r-4xl transition-all hover:bg-white/30 hover:text-white/90 cursor-pointer"
            >
              {t("send")}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
