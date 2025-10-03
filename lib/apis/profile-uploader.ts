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

  if (!token || !user) throw new Error("User not logged in");

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
}

/**
 * @param data
 */
export const updateUserProfile = async (data: UpdateData) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const userCookie = cookieStore.get("user")?.value;

  if (!token) {
    throw new Error("Authentication token is missing. User not logged in.");
  }

  if (!userCookie) {
    throw new Error("User data cookie is missing.");
  }

  const user = JSON.parse(decodeURIComponent(userCookie));

  if (!user || !user.id) {
    throw new Error("User ID is missing in cookie.");
  }

  const userId = user.id;

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
      const errorData = await response.json();
      const errorMessage =
        errorData.error?.message ||
        `Profile update failed with status: ${response.status}`;
      throw new Error(errorMessage);
    }

    const userRes = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/users/me?populate=profile`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!userRes.ok) {
      throw new Error("Failed to refetch user profile after update.");
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
    console.error("Update profile error:", error);
    throw error;
  }
};
