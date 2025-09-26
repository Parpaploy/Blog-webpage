import axios from "axios";
import { cookies } from "next/headers";

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

    console.log("token:", token);

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
