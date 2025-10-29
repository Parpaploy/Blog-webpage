"use client";

import { IMessage } from "../../../interfaces/strapi.interface";

export default function Chatbox({
  isMyMessage,
  msg,
}: {
  isMyMessage: boolean;
  msg: IMessage;
}) {
  return (
    <div
      className={`max-w-[70%] py-2 px-3 rounded-2xl my-1 ${
        isMyMessage
          ? "self-end bg-blue-500 text-white"
          : "self-start bg-gray-200 text-black"
      }`}
    >
      <strong>
        {!isMyMessage && (msg.author?.username || "System") + ":"}
      </strong>
      {msg.text}
    </div>
  );
}
