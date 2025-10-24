"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { useSidebar } from "../../../../hooks/sidebar";
import RichTextEditor from "@/components/rich-text-editor";
import SubmissionStatusModal from "@/components/edit-blogs/submission-status-modal";
import {
  IBlog,
  IBlogSetting,
  ICategory,
  ISubscribeBlog,
  IUser,
} from "../../../../interfaces/strapi.interface";
import { SubmissionStatus } from "../../../../types/ui.type";
import { updateFreeBlog } from "../../../../lib/apis/blog-uploader";

export default function EditFreeBlogDefaultPage({
  user,
  categories,
  token,
  blogSetting,
  initialBlogData,
}: {
  user: IUser | null;
  categories: ICategory[] | null;
  token: string | undefined;
  blogSetting: IBlogSetting;
  initialBlogData: IBlog;
}) {
  const { t } = useTranslation("editBlog");
  const { isSidebar } = useSidebar();
  const router = useRouter();

  const [title, setTitle] = useState(initialBlogData.title);
  const [description, setDescription] = useState(initialBlogData.description);
  const [category, setCategory] = useState<number[]>(
    initialBlogData.categories.map((c) => c.id)
  );
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(
    () => {
      const mediumUrl = initialBlogData.thumbnail?.formats?.medium?.url;
      const originalUrl = initialBlogData.thumbnail?.url;
      const baseUrl = process.env.NEXT_PUBLIC_STRAPI_BASE_URL;

      if (mediumUrl) return `${baseUrl}${mediumUrl}`;
      if (originalUrl) return `${baseUrl}${originalUrl}`;
      return null;
    }
  );

  const parseInitialContent = () => {
    try {
      if (initialBlogData.detail) {
        return typeof initialBlogData.detail === "string"
          ? JSON.parse(initialBlogData.detail)
          : initialBlogData.detail;
      }
    } catch (e) {
      console.error("Failed to parse initial content:", e);
    }
    return { type: "doc", content: [] };
  };

  const [postContent, setPostContent] = useState<any>(parseInitialContent());
  const [submissionStatus, setSubmissionStatus] =
    useState<SubmissionStatus>(null);
  const [error, setError] = useState<string | null>(null);

  const onContentChange = (content: any) => setPostContent(content);

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setThumbnail(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const translateBackendError = (
    message: string | null | undefined
  ): string => {
    if (!message) return t("errors.unknown");
    return message;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmissionStatus("submitting");
    setError(null);

    if (!title || !user?.id || !token) {
      setError(t("errors.missingTitle", "Title is required."));
      setSubmissionStatus("error");
      return;
    }

    try {
      const result = await updateFreeBlog({
        blogId: initialBlogData.documentId,
        authorId: initialBlogData.author?.id!,
        title,
        description,
        detail: postContent,
        categories: category,
        token,
        ...(thumbnail ? { thumbnail: thumbnail as File } : {}),
      });

      if (result.success) setSubmissionStatus("success");
      else {
        setError(translateBackendError(result.error));
        setSubmissionStatus("error");
      }
    } catch (e: any) {
      setError(e.message || t("errors.unknown"));
      setSubmissionStatus("error");
    }
  };

  const handleSuccessRedirect = () => {
    setSubmissionStatus(null);
    router.push("/your-blogs");
    router.refresh();
  };

  const handleGoHome = () => {
    setSubmissionStatus(null);
    router.push("/");
  };

  const handleCloseModal = () => setSubmissionStatus(null);

  return (
    <>
      <main
        className={`w-screen h-full 2xl:pt-[7svh] xl:pt-[9svh] lg:pt-[8svh] md:pt-[6svh] pt-[2svh] overflow-y-auto scrollbar-hide ${
          isSidebar ? "md:pl-65" : "md:pl-25"
        } transition-all md:pb-0 pb-18 md:px-auto px-3`}
      >
        <div className="w-full md:pr-25">
          <section className="w-full md:max-w-3xl mx-auto h-full">
            <form
              onSubmit={handleSubmit}
              className="h-full w-full space-y-6 text-white/80"
            >
              <h1 className="text-3xl font-bold mb-4">{t("editPost")}</h1>

              <div className="w-full flex flex-col md:flex-row gap-4">
                <input
                  type="file"
                  className="sr-only"
                  id="thumbnail-upload"
                  onChange={handleThumbnailChange}
                  accept="image/*"
                />
                <label
                  htmlFor="thumbnail-upload"
                  className={`w-full md:w-[50%] group relative overflow-hidden h-64 cursor-pointer flex justify-center items-center border-2 border-white/30 bg-white/10 backdrop-blur-sm ${
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
                        const fileInput = document.getElementById(
                          "thumbnail-upload"
                        ) as HTMLInputElement;
                        if (fileInput) fileInput.value = "";
                      }}
                      className="cursor-pointer absolute top-3 left-3 z-10 p-2 text-white/80 hover:bg-white/30 hover:text-white/90 bg-white/20 backdrop-blur-sm border border-white/30 shadow-md rounded-4xl transition-all"
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
                            {t("uploadFile")}
                          </span>{" "}
                          {t("orDragAndDrop")}
                        </div>
                        <p className="text-xs text-white/50 mt-2 group-hover:text-white/70 transition-all">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </div>
                    )}
                  </div>
                </label>

                <div className="w-full md:w-[50%] h-64 flex flex-col gap-3">
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-5 py-2.5 bg-white/10 backdrop-blur-sm border border-white/30 shadow-md rounded-4xl focus:ring-2 focus:ring-white/30 focus:outline-none"
                    placeholder={t("titlePlaceholder")}
                    required
                  />
                  <div className="relative flex-1 w-full">
                    <textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      maxLength={blogSetting?.descriptionMaxLength}
                      className="h-full w-full rounded-3xl border border-white/30 bg-white/10 px-5 py-4 pb-8 shadow-md backdrop-blur-sm resize-none focus:outline-none focus:ring-2 focus:ring-white/30"
                      placeholder={t("descriptionPlaceholder")}
                    />
                    {blogSetting?.descriptionMaxLength && (
                      <div
                        className={`absolute bottom-3 right-5 text-xs transition-colors ${
                          description.length >= blogSetting.descriptionMaxLength
                            ? "text-red-400 font-semibold"
                            : "text-white/50"
                        }`}
                      >
                        {description.length}/{blogSetting.descriptionMaxLength}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="opacity-60 cursor-not-allowed">
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    {t("postType")}
                  </label>
                  <div className="relative inline-flex w-full p-1 bg-white/10 backdrop-blur-sm rounded-full border border-white/30 shadow-md">
                    <div
                      className={`absolute top-1 bottom-1 w-[calc(50%-0.5rem)] bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-sm border border-white/30 shadow-md rounded-full transition-all duration-300 ease-in-out left-1`}
                    />
                    <button
                      type="button"
                      disabled
                      className="relative z-10 flex-1 px-4 py-2 rounded-full transition-all duration-200 text-white font-medium"
                    >
                      {t("free")}
                    </button>
                    <button
                      type="button"
                      disabled
                      className="relative z-10 flex-1 px-4 py-2 rounded-full transition-all duration-200 text-white/60"
                    >
                      {t("paid")}
                    </button>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="price-disabled"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    {t("price")}
                  </label>
                  <input
                    type="number"
                    id="price-disabled"
                    value=""
                    className="w-full px-5 py-2.5 bg-white/10 backdrop-blur-sm border border-white/30 shadow-md rounded-4xl focus:ring-2 focus:ring-white/30 focus:outline-none opacity-50 cursor-not-allowed [&::-webkit-inner-spin-button]:opacity-100 [&::-webkit-outer-spin-button]:opacity-100 [&::-webkit-inner-spin-button]:cursor-pointer [&::-webkit-outer-spin-button]:cursor-pointer [&::-webkit-inner-spin-button]:brightness-0 [&::-webkit-inner-spin-button]:invert [&::-webkit-outer-spin-button]:brightness-0 [&::-webkit-outer-spin-button]:invert"
                    disabled
                    readOnly
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {t("categories")}
                  </label>
                  <div className="flex flex-wrap justify-start items-center gap-3 w-full">
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
                          className={`px-4 py-2 rounded-full border duration-200 transition-all shadow-md ${
                            isSelected
                              ? "cursor-pointer text-white/90 bg-white/40 backdrop-blur-sm border-white/50"
                              : "cursor-pointer text-white/80 hover:text-white/90 hover:bg-white/30 bg-white/20 backdrop-blur-sm border-white/30"
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

              <button
                type="submit"
                disabled={submissionStatus === "submitting"}
                className="mb-3 cursor-pointer md:mt-0 -mt-2 text-white/80 hover:text-white/90 w-full px-3 py-3 hover:bg-white/30 bg-white/20 backdrop-blur-sm border border-white/30 shadow-md rounded-4xl transition-all disabled:bg-gray-600 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {submissionStatus === "submitting"
                  ? t("updating", "Updating...")
                  : t("updatePost", "Update Post")}
              </button>
            </form>
          </section>
        </div>
      </main>

      <SubmissionStatusModal
        status={submissionStatus}
        error={error}
        onSuccessRedirect={handleSuccessRedirect}
        onClose={handleCloseModal}
        onGoHome={handleGoHome}
      />
    </>
  );
}
