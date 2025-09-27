import { cookies, headers } from "next/headers";
import { IUser } from "../../../interfaces/strapi.interface";
import { Logout } from "../../../lib/auth";
import LoginButton from "./login-btn";

export default async function Navbar() {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get("user")?.value;
  const user: IUser | null = userCookie ? JSON.parse(userCookie) : null;

  const isLoggedIn = user !== null;

  // console.log(user, ":user");

  return (
    <main className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-[7svh] max-w-[1920px] mx-auto bg-amber-200">
      <div className="w-full h-full flex justify-between items-center">
        <p> Hello, {user ? user.username : "Guest"}</p>
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
                  Login
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
