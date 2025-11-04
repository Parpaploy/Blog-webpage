"use client";

import { IMessage } from "../../../interfaces/strapi.interface";

export default function Chatbox({
  isMyMessage,
  msg,
  profilePic,
  isPrivate = false,
}: {
  isMyMessage: boolean;
  msg: IMessage;
  profilePic: string;
  isPrivate?: boolean;
}) {
  return (
    <div
      className={`flex items-end gap-2 my-1 ${
        isMyMessage ? "justify-end" : "justify-start"
      }`}
    >
      {!isMyMessage && (
        <div className="w-10 h-10 rounded-full overflow-hidden">
          <img
            src={profilePic}
            alt={msg.author?.username || "User"}
            className="object-cover w-full h-full"
          />
        </div>
      )}

      <div
        className={`max-w-[70%] py-2 px-3 rounded-2xl whitespace-normal break-words ${
          isMyMessage
            ? "bg-blue-500 text-white self-end"
            : "bg-gray-200 text-black self-start"
        }`}
      >
        <strong>
          {!isMyMessage &&
            !isPrivate &&
            (msg.author?.username || "System") + ":" + " "}
        </strong>
        {msg.text}
      </div>
    </div>
  );
}
