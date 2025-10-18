"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  updateUserProfile,
  uploadProfilePicture,
} from "../../../lib/apis/profile-uploader";
import { useRouter } from "next/navigation";
import { useSidebar } from "../../../hooks/sidebar";
import { useTranslation } from "react-i18next";
import { FiEdit3 } from "react-icons/fi";
import { Logout } from "../../../lib/auth";
import { IUserProps } from "../../../interfaces/props.interface";

export default function ProfileDefaultPage({ user }: IUserProps) {
  const router = useRouter();

  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");

  const [isSaving, setIsSaving] = useState(false);
  const [isLogout, setIsLogout] = useState(false);
  const [messageKeys, setMessageKeys] = useState<string[]>([]);
  const [messageType, setMessageType] = useState<"success" | "error" | null>(
    null
  );

  const { t } = useTranslation("profile");
  const { isSidebar } = useSidebar();

  const defaultProfileUrl =
    "https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1906669723.jpg";

  useEffect(() => {
    if (user?.profile?.formats?.small?.url) {
      setPreview(
        `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${user.profile.formats.small.url}`
      );
    }
  }, [user]);

  const hasChanges = useMemo(() => {
    const usernameChanged = username !== (user?.username || "");
    const emailChanged = email !== (user?.email || "");
    const hasNewPassword = password.trim() !== "";
    const hasNewProfilePicture = file !== null;

    return (
      usernameChanged || emailChanged || hasNewPassword || hasNewProfilePicture
    );
  }, [username, email, password, file, user]);

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    if (e.currentTarget.src !== defaultProfileUrl) {
      e.currentTarget.src = defaultProfileUrl;
      e.currentTarget.onerror = null;
    }
  };

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
        setFile(null);
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
      className={`w-screen h-full overflow-y-auto 2xl:pt-[7svh] xl:pt-[9svh] lg:pt-[8svh] md:pt-[6svh] ${
        isSidebar ? "pl-65" : "pl-25"
      } transition-all`}
    >
      <div className="flex flex-col items-center space-y-4 text-white/70">
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
                : defaultProfileUrl
            }
            alt="profile preview"
            className="w-full h-full object-cover rounded-full bg-white/10 backdrop-blur-sm border border-white/30 shadow-md transition-all duration-200 group-hover:brightness-70 opacity-95"
            onError={handleImageError}
          />
          <input
            id="profile"
            type="file"
            name="profile"
            accept="image/*"
            onChange={handleChangeFile}
            className="hidden"
            disabled={isSaving || isLogout}
          />
          <label
            htmlFor="profile"
            className={`absolute bottom-0 right-0 bg-white/30 backdrop-blur-sm border border-white/30 shadow-md text-white text-xs p-2 rounded-full ${
              isSaving || isLogout
                ? "cursor-not-allowed opacity-50"
                : "cursor-pointer group-hover:bg-white/10"
            } transition-all`}
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
            className="px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/30 shadow-md rounded-4xl focus:ring-2 focus:ring-white/30 focus:outline-none"
            disabled={isSaving || isLogout}
          />

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("email")}
            className="px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/30 shadow-md rounded-4xl focus:ring-2 focus:ring-white/30 focus:outline-none"
            disabled={isSaving || isLogout}
          />

          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder={t("currentPassword")}
            className="px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/30 shadow-md rounded-4xl focus:ring-2 focus:ring-white/30 focus:outline-none"
            disabled={isSaving || isLogout}
          />

          <div className="w-full flex justify-end items-center -mt-2.5 -mb-0 pr-3">
            <div
              onClick={() => {
                if (!isSaving && !isLogout) {
                  router.push("/forgot-password");
                }
              }}
              className={`${
                !isSaving && !isLogout
                  ? "cursor-pointer hover:text-white/80"
                  : "cursor-not-allowed opacity-50"
              } text-blue-400/80 underline transition-all text-end`}
            >
              {t("forgotPassword")}
            </div>
          </div>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t("newPassword")}
            className="px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/30 shadow-md rounded-4xl focus:ring-2 focus:ring-white/30 focus:outline-none"
            disabled={isSaving || isLogout}
          />

          <button
            type="submit"
            className={`${
              isLogout || isSaving || !hasChanges
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer hover:bg-white/30 hover:text-white/90"
            } text-white/80 w-full px-3 py-2 bg-white/20 backdrop-blur-sm border border-white/30 shadow-md rounded-4xl transition-all`}
            disabled={isSaving || isLogout || !hasChanges}
          >
            {isSaving ? t("saving") : t("saveChanges")}
          </button>
        </form>

        <button
          className={`max-w-sm text-white/80 w-full px-3 py-2 ${
            isLogout || isSaving
              ? "opacity-50 cursor-not-allowed"
              : "cursor-pointer hover:bg-white/30 hover:text-white/90"
          } bg-white/20 backdrop-blur-sm border border-white/30 shadow-md rounded-4xl transition-all`}
          disabled={isLogout || isSaving}
          onClick={async () => {
            setIsLogout(true);
            await Logout();
            router.push("/");
          }}
        >
          {isLogout ? t("isLogout") : t("logout")}
        </button>
      </div>
    </main>
  );
}
