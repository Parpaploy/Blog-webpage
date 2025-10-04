"use client";

import React, { useState, useEffect } from "react";
import {
  updateUserProfile,
  uploadProfilePicture,
} from "../../../lib/apis/profile-uploader";
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
  const [currentPassword, setCurrentPassword] = useState("");

  const [isSaving, setIsSaving] = useState(false);
  const [messageKeys, setMessageKeys] = useState<string[]>([]);
  const [messageType, setMessageType] = useState<"success" | "error" | null>(
    null
  );

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

  const handleSave = async () => {
    setIsSaving(true);
    setMessageKeys([]);
    setMessageType(null);

    const dataToUpdate: {
      username?: string;
      email?: string;
      password?: string;
      currentPassword?: string;
    } = {};

    if (username !== user?.username) dataToUpdate.username = username;
    if (email !== user?.email) dataToUpdate.email = email;
    if (password) {
      if (!currentPassword) {
        setMessageKeys(["enterCurrentPassword"]);
        setMessageType("error");
        setIsSaving(false);
        return;
      }
      dataToUpdate.password = password;
      dataToUpdate.currentPassword = currentPassword;
    }

    const hasProfileDetailsUpdate = Object.keys(dataToUpdate).length > 0;
    const hasPictureUpdate = !!file;

    const backendMessageMap: Record<string, string> = {
      "Current password is incorrect. Please try again.": "passwordError",
      "identifier or password invalid": "passwordError",
      "Validation error": "validationError",
      "Token missing": "sessionExpired",
    };

    try {
      let isSuccess = false;
      const successKeys: string[] = [];

      if (hasProfileDetailsUpdate) {
        const updateResult = await updateUserProfile(dataToUpdate);
        if (updateResult?.error) {
          const i18nKey = backendMessageMap[updateResult.error];
          setMessageKeys([i18nKey || updateResult.error]);
          setMessageType("error");
          setIsSaving(false);
          return;
        }
        isSuccess = true;
        successKeys.push("profileDetailsUpdated");
      }

      if (hasPictureUpdate) {
        await uploadProfilePicture(file as File);
        isSuccess = true;
        successKeys.push("profilePictureUpdated");
      }

      if (isSuccess) {
        successKeys.push("changesSaved");
        setMessageKeys(successKeys);
        setMessageType("success");
        setPassword("");
        setCurrentPassword("");
        router.refresh();
      } else {
        setMessageKeys(["noChanges"]);
        setMessageType("error");
      }
    } catch (err) {
      const errorObject = err as Error;
      let userFriendlyMessage = errorObject.message;

      for (const key in backendMessageMap) {
        if (userFriendlyMessage.includes(key)) {
          userFriendlyMessage = backendMessageMap[key];
          break;
        }
      }

      setMessageKeys(["saveFailed", userFriendlyMessage]);
      setMessageType("error");
    } finally {
      setIsSaving(false);
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
            handleSave();
          }}
          className="flex flex-col space-y-3 w-full max-w-sm mt-6"
        >
          {messageKeys.length > 0 && (
            <div
              className={`text-center p-2 rounded ${
                messageType === "success"
                  ? "bg-green-500/20 text-green-300"
                  : "bg-red-500/20 text-red-300"
              }`}
            >
              {messageKeys.map((k) => t(k)).join(" ")}
            </div>
          )}

          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder={t("username")}
            className="px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/30 shadow-lg rounded-4xl focus:ring-2 focus:ring-white/30 focus:outline-none"
            disabled={isSaving}
          />

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("email")}
            className="px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/30 shadow-lg rounded-4xl focus:ring-2 focus:ring-white/30 focus:outline-none"
            disabled={isSaving}
          />

          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder={t("currentPassword")}
            className="px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/30 shadow-lg rounded-4xl focus:ring-2 focus:ring-white/30 focus:outline-none"
            disabled={isSaving}
          />

          <div className="w-full flex justify-end items-center -mt-2.5 -mb-0 pr-3">
            <a
              href="/forgot-password"
              className="text-blue-400/80 underline hover:text-white/80 transition-all text-end"
            >
              {t("forgotPassword")}
            </a>
          </div>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t("newPassword")}
            className="px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/30 shadow-lg rounded-4xl focus:ring-2 focus:ring-white/30 focus:outline-none"
            disabled={isSaving}
          />

          <button
            type="submit"
            className="cursor-pointer text-white/80 w-full px-3 py-2 hover:bg-white/30 bg-white/20 backdrop-blur-sm border border-white/30 shadow-lg rounded-4xl transition-all disabled:opacity-50"
            disabled={isSaving}
          >
            {isSaving ? t("saving") : t("saveChanges")}
          </button>
        </form>
      </div>
    </main>
  );
}
