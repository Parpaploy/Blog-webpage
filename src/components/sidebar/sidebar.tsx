import { cookies, headers } from "next/headers";
import { IUser } from "../../../interfaces/strapi.interface";
import { Logout } from "../../../lib/auth";
import SidebarDefault from "./sidebar-default";

export default async function Sidebar() {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get("user")?.value;
  const user: IUser | null = userCookie ? JSON.parse(userCookie) : null;

  const isLoggedIn = user !== null;

  // console.log(user, ":user");

  return <SidebarDefault isLoggedIn={isLoggedIn} user={user} Logout={Logout} />;
}
