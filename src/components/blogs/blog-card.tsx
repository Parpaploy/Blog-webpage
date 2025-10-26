"use client";

import React, { useEffect, useRef } from "react";
import { IBlog, ICategory, IUser } from "../../../interfaces/strapi.interface";
import CategoryTag from "../category-tag";
import { useRouter } from "next/navigation";
import HighlightText from "../highlight";
import { useTranslation } from "react-i18next";
import { useToggle } from "../../../hooks/toggle";
import CardPanel from "../card-panel";
import DetailButton from "../detail-btn";

export default function BlogCard({
  blog,
  user,
  selectedCategories = [],
  query,
  showDeletePanel,
  setShowDeletePanel,
  setSelectedDocumentId,
}: {
  blog: IBlog;
  user: IUser | null;
  selectedCategories?: string[];
  query?: string;
  showDeletePanel?: boolean;
  setShowDeletePanel?: (showDeletePanel: boolean) => void;
  setSelectedDocumentId?: (id: string) => void;
}) {
  // console.log(user?.id, ":user?.id");
  // console.log(blog.author?.id, ":blog.author?.id");

  const router = useRouter();

  const { t } = useTranslation("blogs");

  const { openBlogId, setOpenBlogId, registerRef } = useToggle();
  const cardRef = useRef<HTMLDivElement>(null);

  const isToggle = openBlogId === blog.documentId;

  const goToUserBlogs = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (user?.id !== blog.author?.id) {
      router.push(`/user-blogs/${blog.author?.id}`);
    } else {
      router.push("/your-blogs");
    }
  };

  useEffect(() => {
    if (cardRef.current) {
      registerRef(cardRef.current, "blog", blog.documentId);
    }
  }, [registerRef, blog.documentId]);

  return (
    <div
      ref={cardRef}
      onClick={() => {
        router.push(`/blogs/${blog.documentId}`);
      }}
      className="cursor-pointer 2xl:w-95 2xl:h-105 xl:w-85 xl:h-95 md:w-70 md:h-80 w-45 h-55 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 shadow-md overflow-hidden relative"
    >
      <div className="w-full md:h-[50%] h-[45%] rounded-b-2xl overflow-hidden">
        <img
          className="w-full h-full object-cover"
          src={
            blog.thumbnail?.formats?.medium?.url
              ? `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${blog.thumbnail.formats.medium.url}`
              : "https://mom-neuroscience.com/wp-content/uploads/2021/06/no-image.jpg"
          }
          alt={blog.title + "'s tumbnail picture"}
        />
      </div>

      <div className="w-full md:h-[50%] h-[55%] flex flex-col justify-between items-start text-start md:px-5 md:py-3 px-2 py-1">
        <div className="w-full h-fit">
          <h2 className="font-bold xl:text-2xl md:text-xl text-md line-clamp-1">
            <HighlightText text={blog.title} highlight={query} />
          </h2>
          <p className="font-medium xl:text-md md:text-sm text-xs text-black/20 line-clamp-1">
            <HighlightText text={blog.description} highlight={query} />
          </p>

          {blog.author && (
            <div
              className="w-fit max-w-full flex justify-start items-center md:gap-2 gap-1.5 md:mt-1 mt-0.5"
              onClick={goToUserBlogs}
            >
              <div className="xl:w-6 xl:h-6 md:w-5 md:h-5 w-4.5 h-4.5 overflow-hidden rounded-full">
                <img
                  className="w-full h-full object-cover"
                  src={
                    blog.author?.profile?.formats?.small?.url
                      ? `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${blog.author.profile.formats.small.url}`
                      : "https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1906669723.jpg"
                  }
                  alt={blog.author + "profile picture"}
                />
              </div>

              <p className="md:text-lg text-sm">
                <HighlightText text={blog.author?.username} highlight={query} />
              </p>
            </div>
          )}
        </div>

        <div className="w-full flex flex-col gap-1">
          {blog.categories && blog.categories.length > 0 && (
            <div className="2xl:mb-7.5 md:mb-7 2xl:h-16.5 xl:h-12 lg:h-6 md:h-6 h-5 mb-6.5 flex flex-wrap justify-start items-end gap-1 overflow-x-auto pb-0.5 scrollbar-hide">
              {blog.categories.map((cat: ICategory, index: number) => {
                return (
                  <CategoryTag
                    key={index}
                    title={cat.title}
                    textSize="base"
                    selectedCategories={selectedCategories}
                  />
                );
              })}
            </div>
          )}

          <DetailButton
            isToggle={isToggle}
            setOpenBlogId={setOpenBlogId}
            blog={blog}
          />
        </div>
      </div>

      <CardPanel
        blog={blog}
        user={user}
        isToggle={isToggle}
        setOpenBlogId={setOpenBlogId}
        setShowDeletePanel={setShowDeletePanel}
        setSelectedDocumentId={setSelectedDocumentId}
        goToUserBlogs={goToUserBlogs}
        router={router}
        t={t}
        isSub={false}
      />
    </div>
  );
}
