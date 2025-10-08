"use client";

import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSidebar } from "../../../hooks/sidebar";
import RichTextEditor from "@/components/rich-text-editor";
import { ICategory, IUser } from "../../../interfaces/strapi.interface";

export default function AddBlogDefaultPage({
  user,
  categories,
}: {
  user: IUser | null;
  categories: ICategory[] | null;
}) {
  const { t } = useTranslation("addBlog");
  const { isSidebar } = useSidebar();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<number[]>([]);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [author, setAuthor] = useState("");
  const [postContent, setPostContent] = useState("");

  useEffect(() => {
    if (user && user.username) {
      setAuthor(user.username);
    }
  }, [user]);

  const onContentChange = (content: string) => {
    setPostContent(content);
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setThumbnail(file);

      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const blogData = {
      title,
      description,
      category: category,
      thumbnail,
      author: [user?.id],
      content: postContent,
    };
    console.log("Submitting Blog Data:", blogData);
  };

  return (
    <main
      className={`w-full h-full overflow-y-auto p-8 transition-all duration-300 text-white ${
        isSidebar ? "pl-65" : "pl-25"
      }`}
    >
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold mb-4">{t("createNewPost")}</h1>

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

          <div>
            <label
              htmlFor="categories"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              {t("categories")}
            </label>
            {categories && categories.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {categories.map((cat) => {
                  const isSelected = category.includes(cat.id);
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        setCategory((prev) =>
                          isSelected
                            ? prev.filter((id) => id !== cat.id)
                            : [...prev, cat.id]
                        );
                      }}
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
            )}
          </div>
        </div>

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
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
              <div className="flex text-sm text-gray-500 justify-center">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer bg-gray-800 rounded-md font-medium text-blue-500 hover:text-blue-400 focus-within:outline-none p-1"
                >
                  <span>{t("uploadFile")}</span>
                  <input
                    id="file-upload"
                    name="file-upload"
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

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {t("content")}
          </label>

          <RichTextEditor content={postContent} onChange={onContentChange} />
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-200"
          >
            {t("publishPost")}
          </button>
        </div>
      </form>
    </main>
  );
}
