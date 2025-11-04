import axios from "axios";
import qs from "qs";
import { IMessage, IUser } from "../interfaces/strapi.interface";

export const fetchGlobalMessages = async (
  token: string | undefined
): Promise<IMessage[]> => {
  try {
    if (!token) {
      console.error("No token provided to fetchGlobalMessages");
      return [];
    }
    const query = qs.stringify(
      {
        filters: {
          recipient: {
            $null: true,
          },
        },
        populate: {
          author: {
            populate: ["profile"],
          },
        },
        sort: "createdAt:asc",
      },
      {
        encodeValuesOnly: true,
      }
    );
    console.log("🔍 Query string:", query);
    console.log(
      "🔍 Full URL:",
      `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/messages?${query}`
    );
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/messages?${query}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.data;
  } catch (error: any) {
    console.log("❌ error fetching global messages:", error);
    console.log("❌ error response:", error.response?.data);
    console.log("❌ error.response.data.error:", error.response?.data?.error);
    console.log("❌ error status:", error.response?.status);
    return [];
  }
};

export const fetchPrivateMessages = async (
  token: string | undefined,
  myDocumentId: string,
  otherUserDocumentId: string
): Promise<IMessage[]> => {
  try {
    if (!token) {
      console.error("No token provided to fetchPrivateMessages");
      return [];
    }

    const query = qs.stringify(
      {
        filters: {
          $or: [
            {
              $and: [
                { author: { documentId: myDocumentId } },
                { recipient: { documentId: otherUserDocumentId } },
              ],
            },
            {
              $and: [
                { author: { documentId: otherUserDocumentId } },
                { recipient: { documentId: myDocumentId } },
              ],
            },
          ],
        },
        populate: {
          author: {
            populate: ["profile"],
          },
          recipient: {
            populate: ["profile"],
          },
        },

        sort: "createdAt:asc",
      },
      { encodeValuesOnly: true }
    );

    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/messages?${query}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return res.data.data;
  } catch (err) {
    console.error("error fetching private messages:", err);
    return [];
  }
};

export const fetchRecipientByDocumentId = async (
  documentId: string,
  token: string | undefined
): Promise<IUser | null> => {
  if (!token) return null;

  try {
    const query = qs.stringify(
      { filters: { documentId } },
      { encodeValuesOnly: true }
    );

    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/users?${query}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const data = Array.isArray(res.data) ? res.data : res.data.data;
    return data?.[0] || null;
  } catch (err) {
    console.error("Failed to fetch user by documentId:", err);
    return null;
  }
};
