"use client";

import { useEffect, useState } from "react";
import { useSocket } from "../../../lib/socketContext";
import { useSidebar } from "../../../hooks/sidebar";
import { IMessage, IUser } from "../../../interfaces/strapi.interface";
import { fetchMessages } from "../../../lib/chat-api";

export default function ChatDefaultPage({
  user,
  token,
}: {
  user: IUser | null;
  token: string | undefined;
}) {
  const socket = useSocket();
  const isSidebar = useSidebar();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadMessages = async () => {
      if (!token) {
        console.log("No token, cannot fetch messages.");
        setIsLoading(false);
        return;
      }

      try {
        const initialMessages = await fetchMessages(token);
        if (initialMessages) {
          setMessages(initialMessages);
        }
      } catch (error) {
        console.error("Failed to load messages:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMessages();
  }, [token]);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMessage: IMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!socket || !currentMessage.trim()) return;
    socket.emit("sendMessage", {
      text: currentMessage,
    });
    setCurrentMessage("");
  };

  if (isLoading) {
    return (
      <main className="...">
        <h2>Realtime Chat</h2>
        <div>Loading chat history...</div>
      </main>
    );
  }

  return (
    <main
      className={`w-screen h-full 2xl:pt-[7svh] xl:pt-[9svh] lg:pt-[8svh] md:pt-[6svh] pt-[2svh] text-white/80 ${
        isSidebar ? "md:pl-65" : "md:pl-25"
      } transition-all duration-300 scrollbar-hide relative md:pb-0 !pb-18`}
    >
      <h2>Realtime Chat</h2>

      <div
        style={{
          height: "400px",
          border: "1px solid #ccc",
          overflowY: "auto",
          padding: "10px",
          marginBottom: "10px",
        }}
      >
        {messages &&
          messages.length > 0 &&
          messages.map((msg) => (
            <div key={msg.id}>
              <strong>{msg.author?.username || "System"}:</strong> {msg.text}
            </div>
          ))}
      </div>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          placeholder="Type your message..."
          style={{ width: "80%", padding: "5px" }}
        />
        <button type="submit">Send</button>
      </form>
    </main>
  );
}
