"use server";

import { cookies } from "next/headers";

/**
 * @param file
 */
export async function uploadProfilePicture(file: File) {
  if (!file) throw new Error("No file provided");

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const userCookie = cookieStore.get("user")?.value;
  const user = userCookie ? JSON.parse(userCookie) : null;

  if (!token || !user) throw new Error("Please log in again");

  try {
    const formData = new FormData();
    formData.append("files", file);
    formData.append("ref", "plugin::users-permissions.user");
    formData.append("refId", String(user.id));
    formData.append("field", "profile");

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/upload`,
      {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Upload failed: ${text}`);
    }

    const uploaded = await res.json();

    const userRes = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/users/me?populate=profile`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!userRes.ok) {
      const text = await userRes.text();
      throw new Error(`Fetch user failed: ${text}`);
    }

    const updatedUser = await userRes.json();
    // console.log("updatedUser", updatedUser);

    cookieStore.set("user", JSON.stringify(updatedUser), {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return { uploaded, updatedUser };
  } catch (err) {
    console.error("Upload error:", err);
    throw err;
  }
}

interface UpdateData {
  username?: string;
  email?: string;
  password?: string;
  currentPassword?: string;
}

/**
 * @param data
 */
export const updateUserProfile = async (
  data: UpdateData
): Promise<any | { error: string }> => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const userCookie = cookieStore.get("user")?.value;

  if (!token) {
    return {
      error: "Authentication Error: Please log in again (Token missing).",
    };
  }

  const user = userCookie ? JSON.parse(decodeURIComponent(userCookie)) : null;
  if (!user || !user.id || !user.email) {
    return {
      error: "Session Error: User data is incomplete. Please log in again.",
    };
  }
  const userId = user.id;

  if (data.password && data.currentPassword) {
    const loginResponse = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/auth/local`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: user.email,
          password: data.currentPassword,
        }),
      }
    );

    if (!loginResponse.ok) {
      let errorMessage = "Current password is incorrect. Please try again.";
      try {
        const errorData = await loginResponse.json();

        if (
          errorData.error?.message &&
          errorData.error.message.includes("Invalid identifier or password")
        ) {
          errorMessage = "Current password is incorrect. Please try again.";
        } else {
          errorMessage = errorData.error?.message || errorMessage;
        }
      } catch (e) {}

      return { error: errorMessage };
    }

    delete data.currentPassword;
  }

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/users/${userId}`,
      {
        method: "PUT",
        headers: headers,
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      let errorMessage = `Profile update failed with status: ${response.status}.`;
      try {
        const errorData = await response.json();

        errorMessage = errorData.error?.message || errorMessage;
      } catch (e) {}

      return { error: errorMessage };
    }

    const userRes = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/users/me?populate=profile`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!userRes.ok) {
      throw new Error(
        "Successfully updated details, but failed to refresh user data."
      );
    }
    const updatedUser = await userRes.json();

    cookieStore.set("user", JSON.stringify(updatedUser), {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return updatedUser;
  } catch (error) {
    const finalErrorMessage = (error as Error).message.includes("fetch failed")
      ? "Network connection error or API is unavailable. Please try again."
      : (error as Error).message;

    return { error: finalErrorMessage };
  }
};
