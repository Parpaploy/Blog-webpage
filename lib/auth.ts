"use server";

import axios from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function Signup(formData: FormData) {
  try {
    const username = formData.get("username") as string | null;
    const email = formData.get("email") as string | null;
    const password = formData.get("password") as string | null;

    if (!username || !email || !password) {
      redirect("/signup?error=Username,+email+and+password+are+required");
      return;
    }

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/auth/local/register`,
      { username, email, password }
    );

    const cookieStore = await cookies();
    cookieStore.set("token", response.data.jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    cookieStore.set("user", JSON.stringify(response.data.user), {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24,
    });
  } catch (error: unknown) {
    console.log(error, ":error");

    redirect("/signup?error=Signup+failed");
    return;
  }

  redirect("/subscribe-blogs");
}

export async function Login(formData: FormData) {
  try {
    const email = formData.get("email") as string | null;
    const password = formData.get("password") as string | null;

    if (!email || !password) {
      redirect("/login?error=Email+and+password+are+required");
      return;
    }

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/auth/local`,
      { identifier: email, password }
    );

    const cookieStore = await cookies();
    cookieStore.set("token", response.data.jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    cookieStore.set("user", JSON.stringify(response.data.user), {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24,
    });
  } catch (error: unknown) {
    console.log(error, ":error");

    redirect("/login?error=Login+failed");
  }

  redirect("/subscribe-blogs");
}

export async function Logout() {
  const cookieStore = await cookies();
  cookieStore.set("token", "", { maxAge: -1, path: "/" });
  cookieStore.set("user", "", { maxAge: -1, path: "/" });
  redirect("/");
}
