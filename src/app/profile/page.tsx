import { cookies } from "next/headers";
import ProfileDefaultPage from "./profile-default-page";
import { IUser } from "../../../interfaces/strapi.interface";
import { fetchUser } from "../../../lib/api";

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get("user")?.value;
  const initialUser: IUser | null = userCookie ? JSON.parse(userCookie) : null;

  const fetchedUser: IUser | null = await fetchUser();

  const userToShow = fetchedUser || initialUser;

  return <ProfileDefaultPage user={userToShow} />;
}
