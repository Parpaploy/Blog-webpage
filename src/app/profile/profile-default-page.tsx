"use client";

import React, { useState, useEffect } from "react";
import { uploadProfilePicture } from "../../../lib/apis/profile-uploader";
import { useRouter } from "next/navigation";
import { useSidebar } from "../../../hooks/sidebar";
import { useTranslation } from "react-i18next";
import { IUser } from "../../../interfaces/strapi.interface";

interface Props {
  user: IUser | null;
}

export default function ProfileDefaultPage({ user }: Props) {
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const { t } = useTranslation("profile");
  const { isSidebar } = useSidebar();
  const router = useRouter();

  useEffect(() => {
    console.log("user object:", user);

    if (user?.profile?.formats?.small?.url) {
      setPreview(
        `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${user.profile.formats.small.url}`
      );
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      className={`w-full h-full ${
        isSidebar ? "pl-65" : "pl-25"
      } transition-all`}
    >
      <div className="flex flex-col items-center space-y-3">
        <label htmlFor="profile" className="text-sm font-medium text-gray-600">
          Profile picture
        </label>

        <div className="relative w-28 h-28">
          <img
            src={
              file
                ? URL.createObjectURL(file)
                : user?.profile?.formats?.small?.url
                ? `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${user.profile.formats.small.url}`
                : "https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1906669723.jpg"
            }
            alt="profile preview"
            className="w-full h-full object-cover rounded-full border border-gray-300 shadow-sm"
          />

          <input
            id="profile"
            type="file"
            name="profile"
            accept="image/*"
            onChange={handleChange}
            className="hidden"
          />
          <label
            htmlFor="profile"
            className="absolute bottom-0 right-0 bg-blue-500 text-white text-xs px-3 py-1 rounded-full cursor-pointer shadow hover:bg-blue-600 transition-all"
          >
            Change
          </label>
        </div>

        <button
          onClick={handleUpload}
          className="mt-2 bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600 transition-all"
        >
          Upload
        </button>
      </div>
    </main>
  );
}
