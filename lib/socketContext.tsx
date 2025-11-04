"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { io, type Socket } from "socket.io-client";
import { getCookie } from "cookies-next";

const SocketContext = createContext<Socket | null>(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const token = getCookie("token");

    if (!token) {
      console.log("No token found, socket not connecting.");
      return;
    }

    const newSocket = io(process.env.NEXT_PUBLIC_STRAPI_BASE_URL as string, {
      auth: {
        token: token,
      },
    });

    newSocket.on("connect", () => {
      console.log("Socket connected (Client):", newSocket.id);
    });

    newSocket.on("disconnect", () => {
      console.log("Socket disconnected (Client)");
    });

    newSocket.on("connect_error", (err: Error) => {
      console.error("Socket Connection Error:", err.message);
    });

    setSocket(newSocket);

    return () => {
      console.log("Disconnecting socket...");
      newSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
