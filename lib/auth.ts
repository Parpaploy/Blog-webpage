"use server";

import axios from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function Signup(formData: FormData) {
  try {
    const username = formData.get("username") as string | null;
    const email = formData.get("email") as string | null;
    const password = formData.get("password") as string | null;
    const profileFile = formData.get("profile") as File | null;

    if (!username || !email || !password) {
      redirect("/signup?error=All+fields+are+required");
      return;
    }

    // ✅ Step 1: Register user
    const registerRes = await axios.post(
      `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/auth/local/register`,
      { username, email, password }
    );

    const { jwt, user } = registerRes.data;

    let uploadedProfileId: number | null = null;

    // ✅ Step 2: Upload profile picture (ถ้ามีไฟล์)
    if (profileFile) {
      const uploadForm = new FormData();
      uploadForm.append("files", profileFile);

      const uploadRes = await axios.post(
        `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/upload`,
        uploadForm,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );

      uploadedProfileId = uploadRes.data[0]?.id;
    }

    // ✅ Step 3: Update user with profile picture
    if (uploadedProfileId) {
      await axios.put(
        `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/users/${user.id}`,
        { profile: uploadedProfileId },
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
    }

    // ✅ Save cookies
    const cookieStore = await cookies();
    cookieStore.set("token", jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    // ดึง user ใหม่หลังจากอัพเดท profile
    const updatedUser = await axios.get(
      `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/users/${user.id}?populate=profile`,
      { headers: { Authorization: `Bearer ${jwt}` } }
    );

    cookieStore.set("user", JSON.stringify(updatedUser.data), {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    redirect("/subscribe-blogs");
  } catch (error: any) {
    console.error(error?.response?.data || error);
    redirect("/signup?error=Signup+failed");
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
