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
      `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/blogs?populate[thumbnail]=true&populate[author][populate]=*&populate[categories]=true`
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

export const fetchBlogsByDocumentId = async (documentId: string) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/blogs?filters[documentId][$eq]=${documentId}&populate=*`
    );

    if (response.data.data && response.data.data.length > 0) {
      return response.data.data[0];
    }

    return null;
  } catch (error) {
    console.log("error fetching blog:", error);
    return null;
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
      `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/subscribe-blogs?populate[thumbnail]=true&populate[author][populate]=*&populate[categories]=true`
      // {
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //   },
      // }
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

export const fetchSubscribeBlogsByDocumentId = async (documentId: string) => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      console.log("Cannot fetch subscribe blog: No token found.");
      return null;
    }

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/subscribe-blogs?filters[documentId][$eq]=${documentId}&populate=*`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.data && response.data.data.length > 0) {
      return response.data.data[0];
    }
    return null;
  } catch (error) {
    console.error("Error fetching subscribe blog:", error);
    return null;
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

// export const fetchAllBlogsByAuthor = async (id: string) => {
//   try {
//     const response = await axios.get(
//       `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/users/${id}?populate[blogs]=*&populate[subscribe_blogs][populate]=*`
//     );
//     return response.data.data;
//   } catch (error) {
//     console.log("error fetching user:", error);
//   }
// };

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

export const fetchHighlight = async () => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/highlight?populate[blogs][populate][thumbnail]=true&populate[blogs][populate][author][populate]=*&populate[blogs][populate][categories]=true&populate[subscribe_blogs][populate][thumbnail]=true&populate[subscribe_blogs][populate][author][populate]=*&populate[subscribe_blogs][populate][categories]=true`
    );

    return response.data.data;
  } catch (error) {
    console.log("error:", error);
  }
};

export const fetchBlogSetting = async () => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/blog-setting`
    );

    return response.data.data;
  } catch (error) {
    console.log("error:", error);
  }
};
