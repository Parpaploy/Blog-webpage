import axios from "axios";
import { cookies } from "next/headers";

export const fetchSubscribeBlogs = async () => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    console.log("token:", token);

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/subscribe-blogs`,
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
