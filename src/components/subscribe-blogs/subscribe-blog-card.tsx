"use client";

import React, { useEffect, useRef } from "react";
import {
  ICategory,
  ISubscribeBlog,
  IUser,
} from "../../../interfaces/strapi.interface";
import { FormatDate } from "../../../utils/format-date";
import CategoryTag from "../category-tag";
import { useRouter } from "next/navigation";
import Star from "./star";
import HighlightText from "../highlight";
import { FiMoreHorizontal } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { useToggle } from "../../../hooks/toggle";
import CardPanel from "../card-panel";

export default function SubscribeBlogCard({
  subBlog,
  user,
  selectedCategories = [],
  query,
  showDeletePanel,
  setShowDeletePanel,
  setSelectedDocumentId,
}: {
  subBlog: ISubscribeBlog;
  user: IUser | null;
  selectedCategories?: string[];
  query?: string;
  showDeletePanel?: boolean;
  setShowDeletePanel?: (showDeletePanel: boolean) => void;
  setSelectedDocumentId?: (id: string) => void;
}) {
  const router = useRouter();

  const { t } = useTranslation("subscribeBlogs");

  const { openBlogId, setOpenBlogId, registerRef } = useToggle();
  const cardRef = useRef<HTMLDivElement>(null);

  const isToggle = openBlogId === subBlog.documentId;

  const goToUserBlogs = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (user?.id !== subBlog.author?.id) {
      router.push(`/user-blogs/${subBlog.author?.id}`);
    } else {
      router.push("/your-blogs");
    }
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenBlogId(isToggle ? null : subBlog.documentId);
  };

  useEffect(() => {
    if (cardRef.current) {
      return registerRef(cardRef.current, "blog", subBlog.documentId);
    }
  }, [registerRef, subBlog.documentId]);

  return (
    <div
      ref={cardRef}
      onClick={() => {
        router.push(`/subscribe-blogs/${subBlog.documentId}`);
      }}
      className="cursor-pointer 2xl:w-95 2xl:h-105 xl:w-85 xl:h-95 md:w-70 md:h-80 w-45 h-55 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 shadow-md overflow-hidden relative"
    >
      <div className="w-full md:h-[50%] h-[45%] rounded-b-2xl overflow-hidden">
        <img
          className="w-full h-full object-cover"
          src={
            subBlog.thumbnail?.formats?.medium?.url
              ? `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${subBlog.thumbnail.formats.medium.url}`
              : "https://mom-neuroscience.com/wp-content/uploads/2021/06/no-image.jpg"
          }
          alt={subBlog.title + "'s tumbnail picture"}
        />
      </div>

      <div className="w-full md:h-[50%] h-[55%] flex flex-col justify-between items-start text-start md:px-5 md:py-3 px-2 py-1">
        <div className="w-full h-fit">
          <h2 className="font-bold xl:text-2xl md:text-xl text-md line-clamp-1">
            <HighlightText text={subBlog.title} highlight={query} />
          </h2>
          <p className="font-medium xl:text-md md:text-sm text-xs text-black/20 line-clamp-1">
            <HighlightText text={subBlog.description} highlight={query} />
          </p>

          {subBlog.author && (
            <div
              className="w-fit max-w-full flex justify-start items-center md:gap-2 gap-1.5 md:mt-1 mt-0.5"
              onClick={goToUserBlogs}
            >
              <div className="xl:w-6 xl:h-6 md:w-5 md:h-5 w-4.5 h-4.5 overflow-hidden rounded-full">
                <img
                  className="w-full h-full object-cover"
                  src={
                    subBlog.author?.profile?.formats?.small?.url
                      ? `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${subBlog.author.profile.formats.small.url}`
                      : "https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1906669723.jpg"
                  }
                  alt={subBlog.author + "profile picture"}
                />
              </div>

              <p className="md:text-lg text-sm">
                <HighlightText
                  text={subBlog.author?.username}
                  highlight={query}
                />
              </p>
            </div>
          )}
        </div>

        <div className="w-full flex flex-col gap-1">
          {subBlog.categories && subBlog.categories.length > 0 && (
            <div className="2xl:mb-7.5 md:mb-7 2xl:h-16.5 xl:h-12 lg:h-6 md:h-6 h-5 mb-6.5 flex flex-wrap justify-start items-end gap-1 overflow-x-auto pb-0.5 scrollbar-hide">
              {subBlog.categories.map((cat: ICategory, index: number) => {
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

          <div className="absolute md:bottom-2 md:right-2 bottom-1.5 right-1.5 flex items-center justify-end md:gap-3 gap-1">
            <p className="xl:text-xs lg:text-[10px] md:text-[14px] text-[10px] text-black/20">
              {FormatDate(subBlog.createdAt)}
            </p>
            <button
              onClick={handleToggle}
              className={`${
                isToggle
                  ? "bg-black/70 text-white/90"
                  : "bg-black/50 hover:bg-black/70 text-white/80 hover:text-white/90"
              } md:text-lg text-sm cursor-pointer rounded-full border border-white/30 md:p-1 p-0.5 backdrop-blur-sm backdrop-brightness-200 transition-all`}
            >
              <FiMoreHorizontal />
            </button>
          </div>
        </div>
      </div>

      <CardPanel
        blog={subBlog}
        user={user}
        isToggle={isToggle}
        setOpenBlogId={setOpenBlogId}
        setShowDeletePanel={setShowDeletePanel}
        setSelectedDocumentId={setSelectedDocumentId}
        goToUserBlogs={goToUserBlogs}
        router={router}
        t={t}
      />

      <Star />

      <div className="absolute md:text-md text-sm md:top-2.5 md:right-2.5 top-1.5 right-1.5 px-1 rounded-md text-white/80 bg-white/10 backdrop-blur-sm border border-white/20 shadow-xs">
        {subBlog.price} {t("baht")}
      </div>
    </div>
  );
}
