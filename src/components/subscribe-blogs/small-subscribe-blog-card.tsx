"use client";

import React, { useEffect, useRef } from "react";
import { IBlog, ICategory, IUser } from "../../../interfaces/strapi.interface";
import { FormatDate } from "../../../utils/format-date";
import { useSidebar } from "../../../hooks/sidebar";
import CategoryTag from "../category-tag";
import { useRouter } from "next/navigation";
import Star from "./star";
import { useTranslation } from "react-i18next";
import CardPanel from "../card-panel";
import DetailButton from "../detail-btn";
import { useToggle } from "../../../hooks/toggle";

export default function SmallSubscribeBlogCard({
  subBlog,
  user,
  setShowDeletePanel,
  setSelectedDocumentId,
}: {
  subBlog: IBlog;
  user: IUser | null;
  setShowDeletePanel?: (showDeletePanel: boolean) => void;
  setSelectedDocumentId?: (id: string) => void;
}) {
  const { isSidebar } = useSidebar();

  const { t } = useTranslation("subscribeBlogs");

  const router = useRouter();

  const { openBlogId, setOpenBlogId, registerRef } = useToggle();
  const isToggle = openBlogId === subBlog.documentId;

  const cardRef = useRef<HTMLDivElement>(null);

  const goToUserBlogs = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (user?.id !== subBlog.author?.id) {
      router.push(`/user-blogs/${subBlog.author?.id}`);
    } else {
      router.push("/your-blogs");
    }
  };

  useEffect(() => {
    if (cardRef.current) {
      registerRef(cardRef.current, "blog", subBlog.documentId);
    }
  }, [registerRef, subBlog.documentId]);

  return (
    <div
      ref={cardRef}
      onClick={() => {
        router.push(`/subscribe-blogs/${subBlog.documentId}`);
      }}
      className={`cursor-pointer flex lg:flex-row flex-col lg:min-w-full min-w-60 max-w-60 lg:max-w-full rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 shadow-md overflow-hidden transition-all ${
        isSidebar
          ? "2xl:min-h-45 xl:min-h-35 lg:min-h-30 h-full 2xl:max-h-45 xl:max-h-35 lg:max-h-30"
          : "2xl:min-h-50 xl:min-h-40 lg:min-h-35 h-full 2xl:max-h-50 xl:max-h-40 lg:max-h-35"
      } transition-all relative`}
    >
      <div className="lg:w-[45%] lg:h-full w-full h-[50%] rounded-2xl overflow-hidden">
        <img
          className="w-full h-full object-cover"
          src={
            subBlog.thumbnail?.formats?.medium?.url
              ? `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${subBlog.thumbnail.formats.medium?.url}`
              : "https://mom-neuroscience.com/wp-content/uploads/2021/06/no-image.jpg"
          }
          alt={subBlog.title + "'s tumbnail picture"}
        />
      </div>

      <div
        className={`lg:w-[55%] lg:h-full w-full h-[50%] flex flex-col justify-between items-start ${
          isSidebar
            ? "xl:px-3 xl:py-2 px-2 py-1"
            : "xl:px-5 xl:py-3 md:px-3 md:py-2 px-2 py-1"
        }  transition-all`}
      >
        <div className="w-full text-start">
          <h2 className="font-bold md:text-xl text-md line-clamp-1">
            {subBlog.title}
          </h2>
          <p className="font-medium md:text-md text-sm text-black/20 line-clamp-1">
            {subBlog.description}
          </p>

          {subBlog.author && (
            <div
              className="w-fit max-w-full flex justify-start items-center md:gap-2 gap-1.5"
              onClick={goToUserBlogs}
            >
              <div className="xl:w-6 xl:h-6 lg:w-4 lg:h-4 w-5 h-5 overflow-hidden rounded-full">
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

              <p className="xl:text-sm lg:text-xs text-sm">
                {subBlog.author?.username}
              </p>
            </div>
          )}
        </div>

        <div className="w-full space-y-1">
          {subBlog.categories && subBlog.categories.length > 0 && (
            <div
              className={`transition-all duration-300 ${
                isSidebar
                  ? "2xl:h-13 xl:h-4.5 lg:h-4.5 md:h-5.5 h-5.5 2xl:mb-8 xl:mb-7.5 lg:mb-6.5 md:mb-8.5 mb-6"
                  : "2xl:h-16.5 xl:h-5.5 lg:h-7.5 md:h-5 h-5.5 2xl:mb-7.5 xl:mb-7 lg:mb-6 md:mb-7 mb-6"
              } flex flex-wrap justify-start items-end gap-1 overflow-y-auto scrollbar-hide`}
            >
              {subBlog.categories.map((cat: ICategory, index: number) => {
                return (
                  <CategoryTag
                    key={index}
                    title={cat.title}
                    textSize="sm"
                    isSmall={true}
                  />
                );
              })}
            </div>
          )}

          <DetailButton
            isToggle={isToggle}
            setOpenBlogId={setOpenBlogId}
            blog={subBlog}
            isSmall={true}
          />
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
        isSmall={true}
        isSub={true}
      />

      <Star />
    </div>
  );
}
