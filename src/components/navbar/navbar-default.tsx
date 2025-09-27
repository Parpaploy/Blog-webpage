"use client";

import React from "react";
import LoginButton from "./login-btn";
import { IUser } from "../../../interfaces/strapi.interface";
import { useTranslation } from "react-i18next";

export default function NavbarDefault({
  isLoggedIn,
  user,
  Logout,
}: {
  isLoggedIn: boolean;
  user: IUser | null;
  Logout: (formData: FormData) => void | Promise<void>;
}) {
  //   console.log(user, ":user");
  const { t } = useTranslation("navbar");

  return (
    <main className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-[7svh] max-w-[1920px] mx-auto bg-amber-200">
      <div className="w-full h-full flex justify-between items-center">
        <div className="flex items-center justify-center gap-3">
          <div className="w-7 h-7">
            <img
              className="w-full h-full rounded-full overflow-hidden object-cover aspect-square"
              src={
                `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${user?.profile?.formats?.small?.url}` ||
                ""
              }
              alt={user?.username + "profile picture"}
            />
          </div>
          <p className="font-semibold text-lg">
            สวัสดี{user ? user.username : "Guest"}
          </p>
        </div>

        {user !== null ? (
          <form action={Logout}>
            <button type="submit" className="bg-red-400 p-2 cursor-pointer">
              Logout
            </button>
          </form>
        ) : (
          <>
            {isLoggedIn ? (
              <form action={Logout}>
                <button type="submit" className="bg-red-400 p-2 cursor-pointer">
                  Logout
                </button>
              </form>
            ) : (
              <LoginButton isLoggedIn={isLoggedIn} />
            )}
          </>
        )}
      </div>
    </main>
  );
}
