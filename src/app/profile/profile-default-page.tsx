"use client";

import React, { useState, useEffect } from "react";
import { uploadProfilePicture } from "../../../lib/apis/profile-uploader";
import { useRouter } from "next/navigation";
import { useSidebar } from "../../../hooks/sidebar";
import { useTranslation } from "react-i18next";
import { IUser } from "../../../interfaces/strapi.interface";
import { FiEdit3 } from "react-icons/fi";

interface Props {
  user: IUser | null;
}

export default function ProfileDefaultPage({ user }: Props) {
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");

  const { t } = useTranslation("profile");
  const { isSidebar } = useSidebar();
  const router = useRouter();

  useEffect(() => {
    if (user?.profile?.formats?.small?.url) {
      setPreview(
        `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${user.profile.formats.small.url}`
      );
    }
  }, [user]);

  const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setPreview(URL.createObjectURL(f));
      setFile(f);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    try {
      await uploadProfilePicture(file);
      router.refresh();
      alert("Upload success");
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };

  return (
    <main
      className={`w-full h-full overflow-y-auto 2xl:pt-[7svh] xl:pt-[9svh] lg:pt-[8svh] md:pt-[5svh] ${
        isSidebar ? "pl-65" : "pl-25"
      } transition-all`}
    >
      <div className="flex flex-col items-center space-y-4 text-white/70">
        {/* Avatar Upload */}
        <label
          htmlFor="profile"
          className="relative w-28 h-28 cursor-pointer group"
        >
          <img
            src={
              preview
                ? preview
                : user?.profile?.formats?.small?.url
                ? `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${user.profile.formats.small.url}`
                : "https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1906669723.jpg"
            }
            alt="profile preview"
            className="w-full h-full object-cover rounded-full bg-white/10 backdrop-blur-sm border border-white/30 shadow-lg transition-all duration-200 group-hover:brightness-70 opacity-85"
          />

          <input
            id="profile"
            type="file"
            name="profile"
            accept="image/*"
            onChange={handleChangeFile}
            className="hidden"
          />
          <label
            htmlFor="profile"
            className="absolute bottom-0 right-0 bg-white/30 backdrop-blur-sm border border-white/30 shadow-lg text-white text-xs p-2 rounded-full cursor-pointer group-hover:bg-white/10 transition-all"
          >
            <FiEdit3 size={18} />
          </label>
        </label>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleUpload();
          }}
          className="flex flex-col space-y-3 w-full max-w-sm mt-6"
        >
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/30 shadow-lg rounded-4xl focus:ring-2 focus:ring-white/30 focus:outline-none"
          />

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/30 shadow-lg rounded-4xl focus:ring-2 focus:ring-white/30 focus:outline-none"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New password (optional)"
            className="px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/30 shadow-lg rounded-4xl focus:ring-2 focus:ring-white/30 focus:outline-none"
          />

          <button
            type="submit"
            className="cursor-pointer text-white/80 w-full px-3 py-2 hover:bg-white/30 bg-white/20 backdrop-blur-sm border border-white/30 shadow-lg rounded-4xl transition-all"
          >
            Save Changes
          </button>
        </form>
      </div>
    </main>
  );
}
