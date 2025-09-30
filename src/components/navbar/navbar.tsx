import { cookies } from "next/headers";
import { IUser } from "../../../interfaces/strapi.interface";
import { Logout } from "../../../lib/auth";
import NavbarDefault from "./navbar-default";
import { fetchUser } from "../../../lib/api";

export default async function Navbar() {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get("user")?.value;
  const initialUser: IUser | null = userCookie ? JSON.parse(userCookie) : null;

  const fetchedUser: IUser | null = await fetchUser();

  const userToShow = fetchedUser || initialUser;
  const isLoggedIn = userToShow !== null;

  // console.log(userToShow, ":navbar user");

  return (
    <NavbarDefault isLoggedIn={isLoggedIn} user={userToShow} Logout={Logout} />
  );
}
