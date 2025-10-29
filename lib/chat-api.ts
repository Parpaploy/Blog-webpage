import axios from "axios";

export const fetchMessages = async (token: string | undefined) => {
  try {
    if (!token) {
      console.error("No token provided to fetchMessages");
      return [];
    }

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/messages?populate=author&sort=createdAt:asc`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data.data;
  } catch (error) {
    console.log("error fetching messages:", error);
    return [];
  }
};
