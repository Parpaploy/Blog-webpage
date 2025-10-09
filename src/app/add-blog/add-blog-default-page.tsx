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

    const result = await createBlog({
      title,
      description,
      detail: postContent,
      authorId: user.id,
      categories: category,
      thumbnail,
      token,
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
      className={`w-full h-full overflow-y-auto p-8 transition-all duration-300 text-white ${
        isSidebar ? "pl-65" : "pl-25"
      }`}
    >
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold mb-4">{t("createNewPost")}</h1>

        {/* Title */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            {t("title")}
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-gray-800 border border-gray-600 rounded-md py-2 px-4 focus:ring-blue-500 focus:border-blue-500"
            placeholder={t("titlePlaceholder")}
            required
          />
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            {t("description")}
          </label>
          <textarea
            id="description"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-gray-800 border border-gray-600 rounded-md py-2 px-4 focus:ring-blue-500 focus:border-blue-500"
            placeholder={t("descriptionPlaceholder")}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Author */}
          <div>
            <label
              htmlFor="author"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              {t("author")}
            </label>
            <input
              type="text"
              id="author"
              value={author}
              className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-4 cursor-not-allowed"
              readOnly
            />
          </div>

          {/* Categories */}
          <div>
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
                    className={`px-4 py-2 rounded-md border transition-colors duration-200 ${
                      isSelected
                        ? "bg-blue-600 border-blue-500 text-white"
                        : "bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700"
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
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {t("thumbnail")}
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              {thumbnailPreview ? (
                <img
                  src={thumbnailPreview}
                  alt="Thumbnail Preview"
                  className="mx-auto h-48 w-auto rounded-md object-cover"
                />
              ) : (
                <div className="text-gray-400">No preview</div>
              )}
              <div className="flex text-sm text-gray-500 justify-center">
                <label className="relative cursor-pointer bg-gray-800 rounded-md font-medium text-blue-500 hover:text-blue-400 focus-within:outline-none p-1">
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
              <p className="text-xs text-gray-400">PNG, JPG, GIF up to 10MB</p>
            </div>
          </div>
        </div>

        {/* Rich Text Editor */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {t("content")}
          </label>
          <RichTextEditor content={postContent} onChange={onContentChange} />
        </div>

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
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-200 disabled:bg-gray-500 disabled:cursor-not-allowed"
          >
            {isLoading ? t("publishing") : t("publishPost")}
          </button>
        </div>
      </form>
    </main>
  );
}
