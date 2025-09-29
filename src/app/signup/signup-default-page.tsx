"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { useSidebar } from "../../../hooks/sidebar";
// import ProfileUpload from "../../../lib/profile-upload";

export default function SignupDefaultPage({
  Signup,
}: {
  Signup: (formData: FormData) => void | Promise<void>;
}) {
  const { t } = useTranslation("signup");

  const { isSidebar } = useSidebar();

  return (
    <main
      className={`w-full h-full ${
        isSidebar ? "pl-65" : "pl-25"
      } transition-all`}
    >
      <form action={Signup} className="bg-white rounded-2xl w-full space-y-5">
        <h2 className="text-2xl font-bold text-center text-gray-700">
          {t("title")}
        </h2>

        {/* <ProfileUpload /> */}

        {/* <div className="flex flex-col space-y-2">
          <label
            htmlFor="username"
            className="text-sm font-medium text-gray-600"
          >
            Username
          </label>
          <input
            name="username"
            type="text"
            required
            className="px-3 py-2 border rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div> 

        <div className="flex flex-col space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-gray-600">
            Email
          </label>
          <input
            name="email"
            type="email"
            required
            className="px-3 py-2 border rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>

         <div className="flex flex-col space-y-2">
          <label
            htmlFor="password"
            className="text-sm font-medium text-gray-600"
          >
            Password
          </label>
          <input
            name="password"
            type="password"
            required
            className="px-3 py-2 border rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div> */}

        <div className="flex flex-col gap-5">
          <input
            name="username"
            type="text"
            required
            placeholder="Username"
            className="px-3 py-2 border rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />

          <input
            name="email"
            type="email"
            required
            placeholder="Email"
            className="px-3 py-2 border rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />

          <input
            name="password"
            type="password"
            required
            placeholder="Password"
            className="px-3 py-2 border rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg font-medium 
                     hover:bg-blue-600 transition duration-200 shadow cursor-pointer"
        >
          Sign Up
        </button>

        <div className="flex gap-1 items-center justify-center text-gray-400">
          Already have an account?
          <a href="/login" className="underline cursor-pointer text-blue-600">
            Login
          </a>
        </div>
      </form>
    </main>
  );
}
