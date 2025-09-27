import React from "react";
import { Login } from "../../../lib/auth";

export default function LoginPage() {
  return (
    <main className="w-full min-h-[93svh] max-w-[1920px] mx-auto">
      <form action={Login}>
        <div>
          Email
          <input
            name="email"
            type="email"
            required
            className="border-1 border-gray-400"
          />
        </div>
        <div>
          Password
          <input
            name="password"
            type="password"
            required
            className="border-1 border-gray-400"
          />
        </div>
        {/* Message: {state?.message} */}
        <div>
          <button className="bg-blue-400 p-2 cursor-pointer">Login</button>
        </div>
      </form>
    </main>
  );
}
