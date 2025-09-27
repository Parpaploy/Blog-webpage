import { cookies, headers } from "next/headers";
import { IUser } from "../../../interfaces/strapi.interface";
import { Logout } from "../../../lib/auth";
import NavbarDefault from "./navbar-default";

export default async function Navbar() {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get("user")?.value;
  const user: IUser | null = userCookie ? JSON.parse(userCookie) : null;

  const isLoggedIn = user !== null;

  // console.log(user, ":user");

  return <NavbarDefault isLoggedIn={isLoggedIn} user={user} Logout={Logout} />;
}
