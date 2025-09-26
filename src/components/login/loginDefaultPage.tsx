"use client";

import React from "react";
import { Login } from "../../../lib/auth";

export default function LoginDefaultPage() {
  const initState = {
    message: "",
  };
  const [state, formAction] = React.useActionState(Login, initState);

  return (
    <main className="w-full min-h-[93svh] max-w-[1920px] mx-auto">
      <form action={formAction}>
        <div>
          Email
          <input
            name="email"
            type="email"
            className="border-1 border-gray-400"
          />
        </div>
        <div>
          Password
          <input
            name="password"
            type="password"
            className="border-1 border-gray-400"
          />
        </div>
        Message: {state?.message}
        <div>
          <button className="bg-blue-400 p-2 cursor-pointer">Login</button>
        </div>
      </form>
    </main>
  );
}
