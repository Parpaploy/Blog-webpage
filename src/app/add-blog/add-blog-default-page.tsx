"use client";

import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSidebar } from "../../../hooks/sidebar";
import RichTextEditor from "@/components/rich-text-editor";
import { ICategory, IUser } from "../../../interfaces/strapi.interface";
import { createBlog } from "../../../lib/apis/blog-uploader";

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
      console.log("Successfully created:", result.data);
      alert("สร้างโพสต์สำเร็จ!");
      resetForm();
    } else {
      setError(result.error || "Failed to create post");
    }
  };

  return (
    <main
      className={`w-full h-full 2xl:pt-[7svh] xl:pt-[9svh] lg:pt-[8svh] md:pt-[5svh] ${
        isSidebar ? "pl-65" : "pl-25"
      } transition-all`}
    >
      <form
        onSubmit={handleSubmit}
        className="h-full max-w-4xl mx-auto space-y-6 pb-3 overflow-y-auto text-white/80 px-3 scrollbar-hide"
      >
        <h1 className="text-3xl font-bold mb-4">{t("createNewPost")}</h1>

        {/* Title */}
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/30 shadow-lg rounded-4xl focus:ring-2 focus:ring-white/30 focus:outline-none"
          placeholder={t("titlePlaceholder")}
          required
        />

        {/* Description */}
        <textarea
          id="description"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/30 shadow-lg rounded-3xl focus:ring-2 focus:ring-white/30 focus:outline-none"
          placeholder={t("descriptionPlaceholder")}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Post Type */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {t("postType") || "ประเภทโพสต์"}
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setPostType("free")}
                className={`flex-1 px-4 py-2 rounded-full border duration-200 transition-all shadow-lg ${
                  postType === "free"
                    ? "cursor-pointer text-white/90 bg-white/40 backdrop-blur-sm border-white/30"
                    : "cursor-pointer text-white/80 hover:text-white/90 hover:bg-white/30 bg-white/20 backdrop-blur-sm border-white/30"
                }`}
              >
                {t("free") || "ฟรี"}
              </button>
              <button
                type="button"
                onClick={() => setPostType("price")}
                className={`flex-1 px-4 py-2 rounded-full border duration-200 transition-all shadow-lg ${
                  postType === "price"
                    ? "cursor-pointer text-white/90 bg-white/40 backdrop-blur-sm border-white/30"
                    : "cursor-pointer text-white/80 hover:text-white/90 hover:bg-white/30 bg-white/20 backdrop-blur-sm border-white/30"
                }`}
              >
                {t("paid") || "เสียค่าสมัครสมาชิก"}
              </button>
            </div>
          </div>

          {/* Price (only show if postType is "price") */}
          {postType === "price" && (
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
                className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/30 shadow-lg rounded-4xl focus:ring-2 focus:ring-white/30 focus:outline-none"
                placeholder={t("pricePlaceholder") || "เช่น 99"}
                min="0"
                step="0.01"
                required={postType === "price"}
              />
            </div>
          )}

          {/* Categories */}
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

        {/* Thumbnail */}
        <div>
          <label className="block text-sm font-medium mb-2">
            {t("thumbnail")}
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-white/30 bg-white/10 backdrop-blur-sm border-dashed rounded-3xl">
            <div className="space-y-1 text-center">
              {thumbnailPreview ? (
                <img
                  src={thumbnailPreview}
                  alt="Thumbnail Preview"
                  className="mx-auto h-48 w-auto rounded-md object-cover"
                />
              ) : (
                <div>No preview</div>
              )}
              <div className="flex text-sm justify-center">
                <label className="relative cursor-pointer px-2 py-1 hover:text-white/90 bg-white/10 hover:bg-white/30 transition-all backdrop-blur-sm border border-white/30 shadow-lg rounded-3xl focus:ring-2 focus:ring-white/30 focus:outline-none">
                  <span>{t("uploadFile")}</span>
                  <input
                    type="file"
                    className="sr-only"
                    onChange={handleThumbnailChange}
                    accept="image/*"
                  />
                </label>
                <p className="pl-1">{t("orDragAndDrop")}</p>
              </div>
              <p className="text-xs">PNG, JPG, GIF up to 10MB</p>
            </div>
          </div>
        </div>

        {/* Rich Text Editor */}
        <RichTextEditor content={postContent} onChange={onContentChange} />

        {/* Error */}
        {error && (
          <div className="text-red-400 bg-red-900/30 p-3 rounded-md border border-red-500">
            <p>
              <strong>Error:</strong> {error}
            </p>
          </div>
        )}

        {/* Submit */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="cursor-pointer text-white/80 hover:text-white/90 w-full px-3 py-2 hover:bg-white/30 bg-white/20 backdrop-blur-sm border border-white/30 shadow-lg rounded-4xl transition-all disabled:bg-gray-500 disabled:cursor-not-allowed"
          >
            {isLoading ? t("publishing") : t("publishPost")}
          </button>
        </div>
      </form>
    </main>
  );
}
