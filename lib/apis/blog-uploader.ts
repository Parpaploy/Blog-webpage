import {
  ICreateBlogParams,
  ICreateBlogResponse,
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

    console.log("Posting to endpoint:", endpoint);
    console.log("Blog data:", blogData);

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

export async function updateBlog({
  blogId,
  title,
  description,
  detail,
  categories,
  thumbnail,
  token,
}: ICreateBlogParams & { blogId: number }): Promise<ICreateBlogResponse> {
  try {
    let thumbnailId: number | undefined;

    if (thumbnail) {
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

    if (thumbnailId) {
      blogData.data.thumbnail = thumbnailId;
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/blogs/${blogId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(blogData),
      }
    );

    if (!response.ok) {
      const errorDetails = await response.json();
      throw new Error(errorDetails.error?.message || "Failed to update post");
    }

    const result = await response.json();
    return {
      success: true,
      data: result,
    };
  } catch (error: any) {
    console.error("Failed to update blog:", error);
    return {
      success: false,
      error: error.message || "An unexpected error occurred",
    };
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
