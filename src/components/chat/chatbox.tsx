"use client";

import { useRouter } from "next/navigation";
import { IMessage } from "../../../interfaces/strapi.interface";
import { FormatDate } from "../../../utils/format-date";

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
  const router = useRouter();
  return (
    <div
      className={`flex items-end gap-2 my-1 ${
        isMyMessage ? "justify-end" : "justify-start"
      }`}
    >
      {!isMyMessage && (
        <div
          className="w-10 h-10 rounded-full overflow-hidden cursor-pointer"
          onClick={() => {
            router.push(`/user-blogs/${msg.author.id}`);
          }}
        >
          <img
            src={profilePic}
            alt={msg.author?.username || "User"}
            className="object-cover w-full h-full"
          />
        </div>
      )}

      {isMyMessage && <p>{FormatDate(msg.publishedAt as string)}</p>}

      <div
        className={`max-w-[70%] py-2 px-3 rounded-2xl whitespace-normal break-words backdrop-blur-sm border border-white/30 shadow-md ${
          isMyMessage
            ? "bg-blue-500/50 text-white/80 self-end"
            : "bg-gray-200/50 text-black/80 self-start"
        }`}
      >
        <strong>
          {!isMyMessage &&
            !isPrivate &&
            (msg.author?.username || "System") + ":" + " "}
        </strong>
        {msg.text}
      </div>

      {!isMyMessage && <p>{FormatDate(msg.publishedAt as string)}</p>}
    </div>
  );
}
