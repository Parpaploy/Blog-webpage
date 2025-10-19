import {
  ICreateBlogParams,
  ICreateBlogResponse,
  IUpdateBlogParams,
  IUpdateBlogResponse,
} from "../../interfaces/strapi.interface";

function extractImageUrls(detail: any): string[] {
  const urls: string[] = [];

  if (!detail || typeof detail !== "object") return urls;

  const traverse = (node: any) => {
    if (!node) return;

    if (node.type === "resizableImage" || node.type === "image") {
      if (node.attrs?.src) {
        urls.push(node.attrs.src);
      }
    }

    if (Array.isArray(node.content)) {
      node.content.forEach((child: any) => traverse(child));
    }
  };

  traverse(detail);
  return urls;
}

async function getMediaIdByUrl(
  url: string,
  token: string
): Promise<string | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_STRAPI_BASE_URL || "";

    const urlParts = url.split("/");
    const filename = urlParts[urlParts.length - 1];

    if (!filename) {
      //console.error("❌ No filename found in URL:", url);
      return null;
    }

    //console.log(`🔍 Searching for media with filename: ${filename}`);

    let response = await fetch(
      `${baseUrl}/api/upload/files?filters[url][$eq]=${encodeURIComponent(
        url.replace(baseUrl, "")
      )}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.ok) {
      const files = await response.json();
      if (files.length > 0) {
        //console.log(`✅ Media ID found by URL: ${files[0].id}`);
        return files[0].id;
      }
    }

    response = await fetch(
      `${baseUrl}/api/upload/files?filters[name][$eq]=${encodeURIComponent(
        filename
      )}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.ok) {
      const files = await response.json();
      //console.log(`📁 Found ${files.length} files matching exact filename`);
      if (files.length > 0) {
        //console.log(`✅ Media ID found by exact name: ${files[0].id}`);
        return files[0].id;
      }
    }

    const baseFilename = filename.replace(
      /_[a-f0-9]{10,}\.(jpg|jpeg|png|gif|webp)$/i,
      ""
    );
    //console.log(`🔍 Trying partial match with: ${baseFilename}`);

    response = await fetch(
      `${baseUrl}/api/upload/files?filters[name][$contains]=${encodeURIComponent(
        baseFilename
      )}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.ok) {
      const files = await response.json();
      //console.log(`📁 Found ${files.length} files with partial match`);

      for (const file of files) {
        const fileUrl = `${baseUrl}${file.url}`;
        if (fileUrl === url || file.name === filename) {
          //console.log(`✅ Media ID found by partial match: ${file.id}`);
          return file.id;
        }
      }

      if (files.length > 0) {
        //console.log(`⚠️ Using first partial match: ${files[0].id}`);
        return files[0].id;
      }
    }

    //console.log(`⚠️ No media found for: ${filename}`);
    return null;
  } catch (error) {
    //console.error("❌ Failed to get media ID:", error);
    return null;
  }
}

async function deleteMedia(mediaId: string, token: string): Promise<boolean> {
  try {
    //console.log(`🗑️ Attempting to delete media ID: ${mediaId}`);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/upload/files/${mediaId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      //console.error(`❌ Failed to delete media ${mediaId}:`, response.status, response.statusText, errorText );
      return false;
    }

    //console.log(`✅ Successfully deleted media ID: ${mediaId}`);
    return true;
  } catch (error) {
    //console.error("❌ Exception while deleting media:", error);
    return false;
  }
}

async function deleteUnusedRichTextImages(
  oldDetail: any,
  newDetail: any,
  token: string
): Promise<void> {
  try {
    //console.log("🔍 Starting Rich Text image cleanup...");

    const oldUrls = extractImageUrls(oldDetail);
    const newUrls = extractImageUrls(newDetail);

    //console.log(`📊 Old Rich Text images: ${oldUrls.length}`, oldUrls);
    //console.log(`📊 New Rich Text images: ${newUrls.length}`, newUrls);

    const removedUrls = oldUrls.filter((url) => !newUrls.includes(url));

    if (removedUrls.length === 0) {
      //console.log("✅ No Rich Text images to delete");
      return;
    }

    //console.log(`🗑️ Found ${removedUrls.length} Rich Text images to delete:`,removedUrls);

    for (const url of removedUrls) {
      //console.log(`\n🔄 Processing URL: ${url}`);
      const mediaId = await getMediaIdByUrl(url, token);

      if (mediaId) {
        //console.log(`🗑️ Deleting Rich Text image ${mediaId} from URL ${url}`);
        const deleted = await deleteMedia(mediaId, token);

        if (deleted) {
          //console.log(`✅ Successfully deleted Rich Text image: ${mediaId}`);
        } else {
          //console.log(`❌ Failed to delete Rich Text image: ${mediaId}`);
        }
      } else {
        //console.log(`⚠️ Could not find media ID for URL: ${url}`);
      }
    }

    //console.log("✅ Rich Text image cleanup completed");
  } catch (error) {
    //console.error("❌ Failed to delete unused Rich Text images:", error);
  }
}

async function getBlogWithMedia(
  blogId: string,
  token: string,
  endpoint: string
): Promise<any> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${endpoint}/${blogId}?populate=thumbnail`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    //console.error("Failed to fetch blog:", error);
    return null;
  }
}

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
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const fileExtension = thumbnail.name.split(".").pop() || "jpg";
    const safeFileName = `thumbnail_${timestamp}_${randomStr}.${fileExtension}`;
    const renamedThumbnail = new File([thumbnail], safeFileName, {
      type: thumbnail.type,
    });

    const uploadFormData = new FormData();
    uploadFormData.append("files", renamedThumbnail);

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

    let processedDetail = detail; // detail ที่มี Base64
    if (detail && Object.keys(detail).length > 0) {
      console.log("⏳ Processing Rich Text images before create...");
      // เรียกฟังก์ชันใหม่ของเรา
      processedDetail = await processRichTextImages(detail, token);
      console.log("✅ Rich Text images processed.");
    }

    const blogData: any = {
      data: {
        title,
        description,
        detail:
          processedDetail && Object.keys(processedDetail).length > 0
            ? processedDetail
            : null,
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
      //console.error("Strapi Error:", errorDetails.error || errorDetails);
      throw new Error(errorDetails.error?.message || "Failed to create post");
    }

    const result = await response.json();
    return {
      success: true,
      data: result,
    };
  } catch (error: any) {
    //console.error("Failed to create blog:", error);
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
    let oldThumbnailId: string | undefined;
    let oldDetail: any = null;

    //console.log("🔍 Fetching existing blog data...");

    const existingBlog = await getBlogWithMedia(blogId, token, "/api/blogs");

    if (existingBlog?.data?.detail) {
      oldDetail = existingBlog.data.detail;
      //console.log("📄 Old detail loaded:", oldDetail);
    }

    if (thumbnail) {
      if (existingBlog?.data?.thumbnail?.id) {
        oldThumbnailId = existingBlog.data.thumbnail.id;
        //console.log("🖼️ Old thumbnail ID:", oldThumbnailId);
      }

      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(2, 8);
      const fileExtension = thumbnail.name.split(".").pop() || "jpg";
      const safeFileName = `thumbnail_${timestamp}_${randomStr}.${fileExtension}`;
      const renamedThumbnail = new File([thumbnail], safeFileName, {
        type: thumbnail.type,
      });

      const formData = new FormData();
      formData.append("files", renamedThumbnail);

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
      //console.log("🖼️ New thumbnail ID:", thumbnailId);
    }

    let processedDetail = detail;
    if (detail && Object.keys(detail).length > 0) {
      //console.log("⏳ Processing Rich Text images before update...");
      processedDetail = await processRichTextImages(detail, token);
      //console.log("✅ Rich Text images processed.");
    }

    const blogData: any = {
      data: {
        title,
        description,
        detail:
          processedDetail && Object.keys(processedDetail).length > 0
            ? processedDetail
            : null,
        categories,
      },
    };

    if (thumbnailId) blogData.data.thumbnail = thumbnailId;

    const url = `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/blogs/${blogId}`;

    //console.log("📝 Updating blog...");
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
    //console.log("✅ Blog updated successfully");

    if (oldThumbnailId && thumbnailId) {
      //console.log("🗑️ Deleting old thumbnail:", oldThumbnailId);
      const deleted = await deleteMedia(oldThumbnailId, token);
      //console.log("Delete old thumbnail result:", deleted);
    }

    if (oldDetail && processedDetail) {
      //console.log("\n" + "=".repeat(50));
      //console.log("🔍 CHECKING RICH TEXT IMAGES FOR CLEANUP");
      //console.log("=".repeat(50));
      await deleteUnusedRichTextImages(oldDetail, processedDetail, token);
      //console.log("=".repeat(50) + "\n");
    } else {
      //console.log("⚠️ No old detail found, skipping Rich Text image cleanup");
    }

    return { success: true, data: result };
  } catch (error: any) {
    //console.error("❌ updateFreeBlog failed:", error);
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
    let oldThumbnailId: string | undefined;
    let oldDetail: any = null;

    //console.log("🔍 Fetching existing subscribe blog data...");

    const existingBlog = await getBlogWithMedia(
      blogId,
      token,
      "/api/subscribe-blogs"
    );

    if (existingBlog?.data?.detail) {
      oldDetail = existingBlog.data.detail;
      //console.log("📄 Old detail loaded");
    }

    if (thumbnail) {
      if (existingBlog?.data?.thumbnail?.id) {
        oldThumbnailId = existingBlog.data.thumbnail.id;
        //console.log("🖼️ Old thumbnail ID:", oldThumbnailId);
      }

      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(2, 8);
      const fileExtension = thumbnail.name.split(".").pop() || "jpg";
      const safeFileName = `thumbnail_${timestamp}_${randomStr}.${fileExtension}`;
      const renamedThumbnail = new File([thumbnail], safeFileName, {
        type: thumbnail.type,
      });

      const formData = new FormData();
      formData.append("files", renamedThumbnail);

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
      //console.log("🖼️ New thumbnail ID:", thumbnailId);
    }

    let processedDetail = detail;
    if (detail && Object.keys(detail).length > 0) {
      //console.log("⏳ Processing Rich Text images before update...");
      processedDetail = await processRichTextImages(detail, token);
      //console.log("✅ Rich Text images processed.");
    }

    const blogData: any = {
      data: {
        title,
        description,
        detail:
          processedDetail && Object.keys(processedDetail).length > 0
            ? processedDetail
            : null,
        categories,
      },
    };

    if (thumbnailId) blogData.data.thumbnail = thumbnailId;
    if (price !== undefined && price !== null)
      blogData.data.price = String(price);

    const url = `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/subscribe-blogs/${blogId}`;

    //console.log("📝 Updating subscribe blog...");
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
    //console.log("✅ Subscribe blog updated successfully");

    if (oldThumbnailId && thumbnailId) {
      console.log("🗑️ Scheduling old thumbnail deletion:", oldThumbnailId);
      setTimeout(async () => {
        const deleted = await deleteMedia(oldThumbnailId, token);
        console.log("Delete old thumbnail result:", deleted);
      }, 1000);
    }

    if (oldDetail && processedDetail) {
      //console.log("\n" + "=".repeat(50));
      //console.log("🔍 CHECKING RICH TEXT IMAGES FOR CLEANUP");
      //console.log("=".repeat(50));

      setTimeout(async () => {
        await deleteUnusedRichTextImages(oldDetail, processedDetail, token);
        //console.log("=".repeat(50) + "\n");
      }, 1500);
    } else {
      //console.log("⚠️ No old detail found, skipping Rich Text image cleanup");
    }

    return { success: true, data: result };
  } catch (error: any) {
    //console.error("❌ updateSubscribeBlog failed:", error);
    return { success: false, error: error.message || "Unexpected error" };
  }
}

export async function deleteFreeBlog(
  blogId: string,
  token: string
): Promise<ICreateBlogResponse> {
  try {
    //console.log("🔍 Fetching blog data before deletion...");
    const existingBlog = await getBlogWithMedia(blogId, token, "/api/blogs");
    const thumbnailId = existingBlog?.data?.thumbnail?.id;

    let richTextImages: string[] = [];
    if (existingBlog?.data?.detail) {
      const detail = existingBlog.data.detail;
      richTextImages = extractImageUrls(detail);
      //console.log(`📊 Found ${richTextImages.length} Rich Text images to delete`);
    }

    //console.log("🗑️ Deleting blog...");
    const deleteResponse = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/blogs/${blogId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!deleteResponse.ok) {
      const contentType = deleteResponse.headers.get("content-type");
      let errorMessage = "Failed to delete post";

      if (contentType && contentType.includes("application/json")) {
        try {
          const errorDetails = await deleteResponse.json();
          errorMessage =
            errorDetails.error?.message || errorDetails.message || errorMessage;
        } catch (e) {
          const errorText = await deleteResponse.text();
          errorMessage = errorText || errorMessage;
        }
      } else {
        const errorText = await deleteResponse.text();
        errorMessage =
          errorText ||
          `HTTP ${deleteResponse.status}: ${deleteResponse.statusText}`;
      }

      throw new Error(errorMessage);
    }

    //console.log("✅ Blog deleted successfully");

    if (thumbnailId) {
      //console.log("🗑️ Deleting thumbnail:", thumbnailId);
      await deleteMedia(thumbnailId, token);
    }

    if (richTextImages.length > 0) {
      //console.log("\n" + "=".repeat(50));
      //console.log(`🗑️ DELETING ${richTextImages.length} RICH TEXT IMAGES`);
      //console.log("=".repeat(50));

      for (const url of richTextImages) {
        //console.log(`\n🔄 Processing Rich Text image URL: ${url}`);
        const mediaId = await getMediaIdByUrl(url, token);

        if (mediaId) {
          await deleteMedia(mediaId, token);
        } else {
          //console.log(`⚠️ Could not find media ID for: ${url}`);
        }
      }

      //console.log("=".repeat(50) + "\n");
    }

    const contentType = deleteResponse.headers.get("content-type");
    let result = null;

    if (contentType && contentType.includes("application/json")) {
      const text = await deleteResponse.text();
      if (text) {
        try {
          result = JSON.parse(text);
        } catch (e) {
          console.warn("Could not parse response as JSON:", text);
          result = { message: "Deleted successfully" };
        }
      } else {
        result = { message: "Deleted successfully" };
      }
    } else {
      result = { message: "Deleted successfully" };
    }

    return { success: true, data: result };
  } catch (error: any) {
    //console.error("❌ Failed to delete blog:", error);
    return {
      success: false,
      error: error.message || "An unexpected error occurred",
    };
  }
}

export async function deleteSubscribeBlog(
  blogId: string,
  token: string
): Promise<ICreateBlogResponse> {
  try {
    //console.log("🔍 Fetching subscribe blog data before deletion...");
    const existingBlog = await getBlogWithMedia(
      blogId,
      token,
      "/api/subscribe-blogs"
    );
    const thumbnailId = existingBlog?.data?.thumbnail?.id;

    let richTextImages: string[] = [];
    if (existingBlog?.data?.detail) {
      const detail = existingBlog.data.detail;
      richTextImages = extractImageUrls(detail);
      //console.log(`📊 Found ${richTextImages.length} Rich Text images to delete`);
    }

    //console.log("🗑️ Deleting subscribe blog...");
    const deleteResponse = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/subscribe-blogs/${blogId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!deleteResponse.ok) {
      const contentType = deleteResponse.headers.get("content-type");
      let errorMessage = "Failed to delete post";

      if (contentType && contentType.includes("application/json")) {
        try {
          const errorDetails = await deleteResponse.json();
          errorMessage =
            errorDetails.error?.message || errorDetails.message || errorMessage;
        } catch (e) {
          const errorText = await deleteResponse.text();
          errorMessage = errorText || errorMessage;
        }
      } else {
        const errorText = await deleteResponse.text();
        errorMessage =
          errorText ||
          `HTTP ${deleteResponse.status}: ${deleteResponse.statusText}`;
      }

      throw new Error(errorMessage);
    }

    //console.log("✅ Subscribe blog deleted successfully");

    if (thumbnailId) {
      //console.log("🗑️ Deleting thumbnail:", thumbnailId);
      await deleteMedia(thumbnailId, token);
    }

    if (richTextImages.length > 0) {
      //console.log("\n" + "=".repeat(50));
      //console.log(`🗑️ DELETING ${richTextImages.length} RICH TEXT IMAGES`);
      //console.log("=".repeat(50));

      for (const url of richTextImages) {
        //console.log(`\n🔄 Processing Rich Text image URL: ${url}`);
        const mediaId = await getMediaIdByUrl(url, token);

        if (mediaId) {
          await deleteMedia(mediaId, token);
        } else {
          //console.log(`⚠️ Could not find media ID for: ${url}`);
        }
      }

      //console.log("=".repeat(50) + "\n");
    }

    const contentType = deleteResponse.headers.get("content-type");
    let result = null;

    if (contentType && contentType.includes("application/json")) {
      const text = await deleteResponse.text();
      if (text) {
        try {
          result = JSON.parse(text);
        } catch (e) {
          //console.warn("Could not parse response as JSON:", text);
          result = { message: "Deleted successfully" };
        }
      } else {
        result = { message: "Deleted successfully" };
      }
    } else {
      result = { message: "Deleted successfully" };
    }

    return { success: true, data: result };
  } catch (error: any) {
    //console.error("❌ Failed to delete blog:", error);
    return {
      success: false,
      error: error.message || "An unexpected error occurred",
    };
  }
}

function base64ToFile(base64String: string): File {
  try {
    const parts = base64String.split(";base64,");
    if (parts.length !== 2) {
      throw new Error("Invalid base64 string");
    }

    const contentType = parts[0].split(":")[1];
    if (!contentType) {
      throw new Error("No content type in base64 string");
    }

    const extension = contentType.split("/")[1] || "jpg";

    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const fileName = `richtext_${timestamp}_${randomStr}.${extension}`;

    const byteCharacters = atob(parts[1]);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);

    return new File([byteArray], fileName, { type: contentType });
  } catch (error: any) {
    //console.error("Failed to convert base64 to file:", error);
    throw new Error(`Invalid Base64 string: ${error.message}`);
  }
}

async function processRichTextImages(
  detailNode: any,
  token: string
): Promise<any> {
  if (!detailNode || typeof detailNode !== "object") return detailNode;

  const newNode = { ...detailNode };

  if (
    (newNode.type === "resizableImage" || newNode.type === "image") &&
    newNode.attrs?.src &&
    newNode.attrs.src.startsWith("data:image/")
  ) {
    const base64String = newNode.attrs.src;

    try {
      const fileToUpload = base64ToFile(base64String);

      const formData = new FormData();
      formData.append("files", fileToUpload);

      const uploadResponse = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/upload`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload rich text image");
      }

      const uploadedFiles = await uploadResponse.json();
      const newUrl = uploadedFiles[0]?.url;

      if (newUrl) {
        const fullUrl = `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${newUrl}`;
        //console.log(`✅ Image uploaded, URL: ${fullUrl}`);
        newNode.attrs = { ...newNode.attrs, src: fullUrl };
      } else {
        return null;
      }
    } catch (error) {
      //console.error("❌ Failed to process/upload Base64 image:", error);
      return null;
    }
  }

  if (Array.isArray(newNode.content)) {
    const newContent = await Promise.all(
      newNode.content.map((child: any) => processRichTextImages(child, token))
    );

    newNode.content = newContent.filter(Boolean);
  }

  return newNode;
}
