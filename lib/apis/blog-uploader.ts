import {
  ICreateBlogParams,
  ICreateBlogResponse,
  IUpdateBlogParams,
  IUpdateBlogResponse,
} from "../../interfaces/strapi.interface";

export async function createBlog({
  title,
  description,
  detail,
  authorId,
  categories,
  thumbnail,
  token,
  endpoint = "/api/blogs",
  price,
}: ICreateBlogParams): Promise<ICreateBlogResponse> {
  try {
    const uploadFormData = new FormData();
    uploadFormData.append("files", thumbnail);

    const uploadResponse = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/upload`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: uploadFormData,
      }
    );

    if (!uploadResponse.ok) {
      throw new Error("Failed to upload thumbnail");
    }

    const uploadedFiles = await uploadResponse.json();
    const thumbnailId = uploadedFiles[0]?.id;

    if (!thumbnailId) {
      throw new Error("No thumbnail ID returned from upload");
    }

    const detailString =
      detail && Object.keys(detail).length > 0 ? JSON.stringify(detail) : null;

    const blogData: any = {
      data: {
        title,
        description,
        detail: detailString,
        author: authorId,
        categories,
        thumbnail: thumbnailId,
      },
    };

    if (price !== undefined && price !== null) {
      blogData.data.price = String(price);
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${endpoint}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(blogData),
      }
    );

    if (!response.ok) {
      const errorDetails = await response.json();
      console.error("Strapi Error:", errorDetails.error || errorDetails);
      throw new Error(errorDetails.error?.message || "Failed to create post");
    }

    const result = await response.json();
    return {
      success: true,
      data: result,
    };
  } catch (error: any) {
    console.error("Failed to create blog:", error);
    return {
      success: false,
      error: error.message || "An unexpected error occurred",
    };
  }
}

export async function updateFreeBlog({
  blogId,
  title,
  description,
  detail,
  categories,
  thumbnail,
  token,
}: IUpdateBlogParams & { blogId: string }): Promise<IUpdateBlogResponse> {
  try {
    let thumbnailId: string | undefined;

    if (thumbnail) {
      const formData = new FormData();
      formData.append("files", thumbnail);

      const uploadRes = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/upload`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      if (!uploadRes.ok) throw new Error("Failed to upload new thumbnail");

      const uploadedFiles = await uploadRes.json();
      thumbnailId = uploadedFiles[0]?.id;
    }

    const detailString =
      detail && Object.keys(detail).length > 0 ? JSON.stringify(detail) : null;

    const blogData: any = {
      data: {
        title,
        description,
        detail: detailString,
        categories,
      },
    };

    if (thumbnailId) blogData.data.thumbnail = thumbnailId;

    const url = `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/blogs/${blogId}`;

    const res = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(blogData),
    });

    if (!res.ok) {
      const errText = await res.text();
      let errDetails: any = {};
      try {
        errDetails = JSON.parse(errText);
      } catch {
        errDetails = { message: errText };
      }
      throw new Error(
        errDetails.error?.message ||
          errDetails.message ||
          "Failed to update free blog"
      );
    }

    const result = await res.json();
    return { success: true, data: result };
  } catch (error: any) {
    console.error("updateFreeBlog failed:", error);
    return { success: false, error: error.message || "Unexpected error" };
  }
}

export async function updateSubscribeBlog({
  blogId,
  title,
  description,
  detail,
  categories,
  thumbnail,
  price,
  token,
}: IUpdateBlogParams & { blogId: string }): Promise<IUpdateBlogResponse> {
  try {
    let thumbnailId: string | undefined;

    if (thumbnail) {
      const formData = new FormData();
      formData.append("files", thumbnail);

      const uploadRes = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/upload`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      if (!uploadRes.ok) throw new Error("Failed to upload new thumbnail");

      const uploadedFiles = await uploadRes.json();
      thumbnailId = uploadedFiles[0]?.id;
    }

    const detailString =
      detail && Object.keys(detail).length > 0 ? JSON.stringify(detail) : null;

    const blogData: any = {
      data: {
        title,
        description,
        detail: detailString,
        categories,
      },
    };

    if (thumbnailId) blogData.data.thumbnail = thumbnailId;
    if (price !== undefined && price !== null)
      blogData.data.price = String(price);

    const url = `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/subscribe-blogs/${blogId}`;

    const res = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(blogData),
    });

    if (!res.ok) {
      const errText = await res.text();
      let errDetails: any = {};
      try {
        errDetails = JSON.parse(errText);
      } catch {
        errDetails = { message: errText };
      }
      throw new Error(
        errDetails.error?.message ||
          errDetails.message ||
          "Failed to update subscribe blog"
      );
    }

    const result = await res.json();
    return { success: true, data: result };
  } catch (error: any) {
    console.error("updateSubscribeBlog failed:", error);
    return { success: false, error: error.message || "Unexpected error" };
  }
}

export async function deleteBlog(
  blogId: number,
  token: string
): Promise<ICreateBlogResponse> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/blogs/${blogId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorDetails = await response.json();
      throw new Error(errorDetails.error?.message || "Failed to delete post");
    }

    const result = await response.json();
    return {
      success: true,
      data: result,
    };
  } catch (error: any) {
    console.error("Failed to delete blog:", error);
    return {
      success: false,
      error: error.message || "An unexpected error occurred",
    };
  }
}
