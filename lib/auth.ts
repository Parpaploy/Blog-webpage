"use server";

import axios from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

function parseJwtExpiresIn(value: string | undefined): number {
  if (!value) return 60 * 60 * 24;
  const match = value.match(/^(\d+)([smhd])$/);
  if (!match) return 60 * 60 * 24;
  const amount = parseInt(match[1], 10);
  const unit = match[2];
  switch (unit) {
    case "s":
      return amount;
    case "m":
      return amount * 60;
    case "h":
      return amount * 60 * 60;
    case "d":
      return amount * 60 * 60 * 24;
    default:
      return 60 * 60 * 24;
  }
}

const COOKIE_MAX_AGE = parseJwtExpiresIn(
  process.env.NEXT_PUBLIC_JWT_EXPIRES_IN
);

async function fetchUserWithProfile(jwt: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/users/me?populate=profile`,
    { headers: { Authorization: `Bearer ${jwt}` } }
  );
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Fetch user failed: ${text}`);
  }
  return await res.json();
}

export async function Signup(formData: FormData) {
  try {
    const username = formData.get("username") as string | null;
    const email = formData.get("email") as string | null;
    const password = formData.get("password") as string | null;

    if (!username || !email || !password) {
      redirect("/signup?error=Username,+email+and+password+are+required");
      return;
    }

    // Register user
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/auth/local/register`,
      { username, email, password }
    );

    const jwt = response.data.jwt;
    const updatedUser = await fetchUserWithProfile(jwt);

    const cookieStore = await cookies();
    cookieStore.set("token", jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: COOKIE_MAX_AGE,
    });
    cookieStore.set("user", JSON.stringify(updatedUser), {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: COOKIE_MAX_AGE,
    });

    return { success: true };
    // redirect("/profile");
  } catch (error: unknown) {
    console.log(error, ":error");
    // redirect("/signup?error=Signup+failed");
    return { success: false };
  }
}

export async function Login(formData: FormData) {
  try {
    const email = formData.get("email") as string | null;
    const password = formData.get("password") as string | null;

    if (!email || !password) {
      redirect("/login?error=Email+and+password+are+required");
      return;
    }

    // Login
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/auth/local`,
      { identifier: email, password }
    );

    const jwt = response.data.jwt;
    const updatedUser = await fetchUserWithProfile(jwt);

    const cookieStore = await cookies();
    cookieStore.set("token", jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: COOKIE_MAX_AGE,
    });
    cookieStore.set("user", JSON.stringify(updatedUser), {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: COOKIE_MAX_AGE,
    });

    // redirect("/subscribe-blogs");

    return { success: true };
  } catch (error: unknown) {
    console.log(error, ":error");
    return { success: false };
    // redirect("/login?error=Login+failed");
  }
}

export async function Logout() {
  const cookieStore = await cookies();
  cookieStore.set("token", "", { maxAge: -1, path: "/" });
  cookieStore.set("user", "", { maxAge: -1, path: "/" });
  redirect("/");
}
