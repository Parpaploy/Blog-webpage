import axios from "axios";
import { cookies } from "next/headers";
import { IUser } from "../interfaces/strapi.interface";

export const fetchUser = async (): Promise<IUser | null> => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const userCookie = cookieStore.get("user")?.value;
  const userId = userCookie ? JSON.parse(userCookie).id : null;

  if (!token || !userId) return null;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/users/me?populate=profile`,
    {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    }
  );

  const data = await res.json();
  return data.data;
};

export const fetchBlogs = async () => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/blogs?populate=*`
    );

    return response.data.data;
  } catch (error) {
    console.log("error:", error);
  }
};

export const fetchBlogsByID = async (id: string) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/blogs/${id}?populate=*`
    );

    return response.data.data;
  } catch (error) {
    console.log("error:", error);
  }
};

export const fetchBlogsUserByID = async (id: string) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/blogs/${id}?populate[author][populate]=profile`
    );

    return response.data.data;
  } catch (error) {
    console.log("error:", error);
  }
};

export const fetchSubscribeBlogs = async () => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    // console.log("token:", token);

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/subscribe-blogs?populate=*`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data.data;
  } catch (error) {
    console.log("error:", error);
  }
};

export const fetchSubscribeBlogsByID = async (id: string) => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/subscribe-blogs/${id}?populate=*`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data.data;
  } catch (error) {
    console.log("error:", error);
  }
};

export const fetchSubscribeBlogsUserByID = async (id: string) => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/subscribe-blogs/${id}?populate[author][populate]=profile`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data.data;
  } catch (error) {
    console.log("error:", error);
  }
};

export const fetchCategories = async () => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/categories?populate=*`
    );

    return response.data.data;
  } catch (error) {
    console.log("error:", error);
  }
};
