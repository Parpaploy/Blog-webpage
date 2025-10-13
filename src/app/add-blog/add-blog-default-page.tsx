"use client";

import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSidebar } from "../../../hooks/sidebar";
import RichTextEditor from "@/components/rich-text-editor";
import { ICategory, IUser } from "../../../interfaces/strapi.interface";
import { createBlog } from "../../../lib/apis/blog-uploader";
import { useRouter } from "next/navigation";

export default function AddBlogDefaultPage({
  user,
  categories,
  token,
}: {
  user: IUser | null;
  categories: ICategory[] | null;
  token: string | undefined;
}) {
  const { t } = useTranslation("addBlog");
  const { isSidebar } = useSidebar();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<number[]>([]);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [author, setAuthor] = useState("");
  const [postContent, setPostContent] = useState<any>({
    type: "doc",
    content: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [postType, setPostType] = useState<"free" | "price">("free");
  const [price, setPrice] = useState("");

  const router = useRouter();

  useEffect(() => {
    if (user && user.username) {
      setAuthor(user.username);
    }
  }, [user]);

  const onContentChange = (content: any) => {
    setPostContent(content);
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setThumbnail(file);

      const previewUrl = URL.createObjectURL(file);
      setThumbnailPreview(previewUrl);

      return () => URL.revokeObjectURL(previewUrl);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setCategory([]);
    setThumbnail(null);
    setThumbnailPreview(null);
    setPostContent({ type: "doc", content: [] });
    setPostType("free");
    setPrice("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!thumbnail || !title || !user?.id || !token) {
      setError("Missing required fields. Please check title and thumbnail.");
      setIsLoading(false);
      return;
    }

    if (postType === "price" && (!price || parseFloat(price) <= 0)) {
      setError("Please enter a valid price for paid content.");
      setIsLoading(false);
      return;
    }

    const endpoint =
      postType === "free" ? "/api/blogs" : "/api/subscribe-blogs";

    const result = await createBlog({
      title,
      description,
      detail: postContent,
      authorId: user.id,
      categories: category,
      thumbnail,
      token,
      endpoint,
      ...(postType === "price" && { price: parseFloat(price) }),
    });

    setIsLoading(false);

    if (result.success) {
      // console.log("Successfully created:", result.data);
      alert("สร้างโพสต์สำเร็จ!");
      router.push("/your-blogs");
      resetForm();
    } else {
      setError(result.error || "Failed to create post");
    }
  };

  return (
    <main
      className={`w-full h-full 2xl:pt-[7svh] xl:pt-[9svh] lg:pt-[8svh] md:pt-[6svh] ${
        isSidebar ? "pl-65" : "pl-25"
      } transition-all`}
    >
      <section className="w-full h-full scrollbar-hide overflow-y-auto px-3">
        <form
          onSubmit={handleSubmit}
          className="h-full w-full space-y-6 text-white/80"
        >
          <h1 className="text-3xl font-bold mb-4">{t("createNewPost")}</h1>
          <div className="w-full flex gap-4">
            <input
              type="file"
              className="sr-only"
              id="thumbnail-upload"
              onChange={handleThumbnailChange}
              accept="image/*"
            />
            <label
              htmlFor="thumbnail-upload"
              className={`w-[50%] group relative overflow-hidden h-64 cursor-pointer flex justify-center items-center border-2 border-white/30 bg-white/10 backdrop-blur-sm ${
                !thumbnailPreview && "border-dashed"
              } rounded-3xl hover:bg-white/20 transition-all`}
            >
              {thumbnailPreview && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setThumbnail(null);
                    setThumbnailPreview(null);
                  }}
                  className="cursor-pointer absolute top-3 left-3 z-10 p-2 text-white/80 hover:bg-white/30 hover:text-white/90 bg-white/20 backdrop-blur-sm border border-white/30 shadow-lg rounded-4xl transition-all"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}

              <div className="space-y-1 text-center w-full h-full flex items-center justify-center">
                {thumbnailPreview ? (
                  <img
                    src={thumbnailPreview}
                    alt="Thumbnail Preview"
                    className="w-full h-full rounded-md object-cover"
                  />
                ) : (
                  <div className="py-12">
                    <svg
                      className="mx-auto h-12 w-12 text-white/40 group-hover:text-white/90 transition-all"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="mt-4 text-sm text-white/60 group-hover:text-white/90 transition-all">
                      <span className="font-semibold text-white/80 group-hover:text-white/90 transition-all">
                        {t("uploadFile") || "Click to upload"}
                      </span>{" "}
                      {t("orDragAndDrop") || "or drag and drop"}
                    </div>
                    <p className="text-xs text-white/50 mt-2 group-hover:text-white/70 transition-all">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                )}
              </div>
            </label>

            <div className="w-[50%] h-64 flex flex-col gap-3">
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/30 shadow-lg rounded-4xl focus:ring-2 focus:ring-white/30 focus:outline-none"
                placeholder={t("titlePlaceholder")}
                required
              />

              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="flex-1 w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/30 shadow-lg rounded-3xl focus:ring-2 focus:ring-white/30 focus:outline-none resize-none"
                placeholder={t("descriptionPlaceholder")}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                {t("postType") || "ประเภทโพสต์"}
              </label>
              <div className="relative inline-flex w-full p-1 bg-white/10 backdrop-blur-sm rounded-full border border-white/30 shadow-lg">
                <div
                  className={`absolute top-1 bottom-1 w-[calc(50%-0.5rem)] bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-sm border border-white/30 shadow-lg rounded-full transition-all duration-300 ease-in-out ${
                    postType === "free" ? "left-1" : "left-[calc(50%+0.25rem)]"
                  }`}
                />

                <button
                  type="button"
                  onClick={() => setPostType("free")}
                  className={`relative z-10 flex-1 px-4 py-2 rounded-full transition-all duration-200 ${
                    postType === "free"
                      ? "text-white font-medium"
                      : "text-white/60 hover:text-white/90 hover:bg-white/10 cursor-pointer"
                  }`}
                >
                  {t("free") || "ฟรี"}
                </button>
                <button
                  type="button"
                  onClick={() => setPostType("price")}
                  className={`relative z-10 flex-1 px-4 py-2 rounded-full transition-all duration-200 ${
                    postType === "price"
                      ? "text-white font-medium"
                      : "text-white/60 hover:text-white/90 hover:bg-white/10 cursor-pointer"
                  }`}
                >
                  {t("paid") || "เสียค่าสมัครสมาชิก"}
                </button>
              </div>
            </div>

            {postType === "price" ? (
              <div>
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  {t("price") || "ราคา (บาท)"}{" "}
                  <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  id="price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/30 shadow-lg rounded-4xl focus:ring-2 focus:ring-white/30 focus:outline-none [&::-webkit-inner-spin-button]:opacity-100 [&::-webkit-outer-spin-button]:opacity-100 [&::-webkit-inner-spin-button]:cursor-pointer [&::-webkit-outer-spin-button]:cursor-pointer [&::-webkit-inner-spin-button]:brightness-0 [&::-webkit-inner-spin-button]:invert [&::-webkit-outer-spin-button]:brightness-0 [&::-webkit-outer-spin-button]:invert"
                  placeholder={t("pricePlaceholder") || "เช่น 99"}
                  min="0"
                  step="0.01"
                  required={postType === "price"}
                />
              </div>
            ) : (
              <div>
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  {t("price") || "ราคา (บาท)"}
                </label>
                <input
                  type="number"
                  id="price"
                  value="0"
                  className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/30 shadow-lg rounded-4xl focus:ring-2 focus:ring-white/30 focus:outline-none opacity-50 cursor-not-allowed"
                  disabled
                  readOnly
                />
              </div>
            )}

            <div className={postType === "price" ? "md:col-span-2" : ""}>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t("categories")}
              </label>
              <div className="flex flex-wrap gap-3">
                {categories?.map((cat) => {
                  const isSelected = category.includes(cat.id);
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() =>
                        setCategory((prev) =>
                          isSelected
                            ? prev.filter((id) => id !== cat.id)
                            : [...prev, cat.id]
                        )
                      }
                      className={`px-3 py-2 rounded-full border duration-200 transition-all shadow-lg ${
                        isSelected
                          ? "cursor-pointer text-white/90 bg-white/40 backdrop-blur-sm border border-white/30"
                          : "cursor-pointer text-white/80 hover:text-white/90 hover:bg-white/30 bg-white/20 backdrop-blur-sm border border-white/30"
                      }`}
                    >
                      {cat.title}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          <RichTextEditor
            content={postContent}
            onChange={onContentChange}
            token={token}
          />
          {error && (
            <div className="text-red-400 bg-red-900/30 p-3 rounded-md border border-red-500">
              <p>
                <strong>Error:</strong> {error}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="mb-3 cursor-pointer text-white/80 hover:text-white/90 w-full px-3 py-2 hover:bg-white/30 bg-white/20 backdrop-blur-sm border border-white/30 shadow-lg rounded-4xl transition-all disabled:bg-gray-500 disabled:cursor-not-allowed"
          >
            {isLoading ? t("publishing") : t("publishPost")}
          </button>
        </form>
      </section>
    </main>
  );
}
