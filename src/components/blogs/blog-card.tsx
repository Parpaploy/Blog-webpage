"use client";

import React, { useState } from "react";
import { IBlog, ICategory, IUser } from "../../../interfaces/strapi.interface";
import { FormatDate } from "../../../utils/format-date";
import CategoryTag from "../category-tag";
import { useRouter } from "next/navigation";
import HighlightText from "../highlight";
import { FiEdit3 } from "react-icons/fi";
import { FiMoreHorizontal } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";
import { HiOutlineExclamationCircle } from "react-icons/hi2";

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

  const [isToggle, setIsToggle] = useState<boolean>(false);

  const goToUserBlogs = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (user?.id !== blog.author?.id) {
      router.push(`/user-blogs/${blog.author?.id}`);
    } else {
      router.push("/your-blogs");
    }
  };

  return (
    <div
      onClick={() => {
        router.push(`/blogs/${blog.documentId}`);
      }}
      className="cursor-pointer 2xl:w-95 2xl:h-105 xl:w-85 xl:h-95 w-70 h-80 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 shadow-md overflow-hidden relative"
    >
      <div className="w-full h-[50%] rounded-b-2xl overflow-hidden">
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
      <div className="w-full h-[50%] flex flex-col justify-between items-start text-start px-5 py-3">
        <div className="w-full h-fit">
          <h2 className="font-bold xl:text-2xl text-xl line-clamp-1">
            <HighlightText text={blog.title} highlight={query} />
          </h2>
          <p className="font-medium xl:text-md text-sm text-[#bdbdbd]/70 line-clamp-1">
            <HighlightText text={blog.description} highlight={query} />
          </p>

          {blog.author && (
            <div
              className="w-fit max-w-full flex justify-start items-center gap-2 mt-1"
              onClick={goToUserBlogs}
            >
              <div className="xl:w-6 xl:h-6 w-5 h-5 overflow-hidden rounded-full">
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

              <p>
                <HighlightText text={blog.author?.username} highlight={query} />
              </p>
            </div>
          )}
        </div>

        <div className="w-full flex flex-col gap-1">
          {blog.categories && blog.categories.length > 0 && (
            <div className="2xl:mb-7.5 md:mb-7 2xl:h-16.5 xl:h-12 lg:h-6 md:h-6 h-6.5 flex flex-wrap justify-start items-end gap-1 overflow-x-auto pb-0.5">
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

          <div className="absolute bottom-2 right-2 flex items-center justify-end gap-3">
            <p className="xl:text-xs lg:text-[10px] md:text-[14px] text-[#bdbdbd]/70">
              {FormatDate(blog.createdAt)}
            </p>
            <div
              onClick={(e) => {
                e.stopPropagation();
                setIsToggle(!isToggle);
              }}
              className={`${
                isToggle
                  ? "bg-black/70 text-white/90"
                  : "bg-black/50 hover:bg-black/70 text-white/80 hover:text-white/90"
              } rounded-full border border-white/30 p-1 backdrop-blur-sm backdrop-brightness-200 transition-all`}
            >
              <FiMoreHorizontal />
            </div>
          </div>
        </div>
      </div>

      {isToggle && (
        <div className="absolute bottom-10 right-2 w-60 h-fit bg-black/50 backdrop-blur-sm backdrop-brightness-200 border border-white/30 shadow-md rounded-lg overflow-hidden z-50">
          <div
            onClick={(e) => {
              e.stopPropagation();
              goToUserBlogs(e);
              setIsToggle(false);
            }}
            className={`text-white/80 hover:bg-white/30 hover:text-white/90 backdrop-blur-3xl cursor-pointer text-md transition-all px-3 pt-2`}
          >
            <div
              className={`flex items-center justify-start gap-3 ${
                user?.documentId != blog.author?.documentId && "pb-2"
              }`}
            >
              <HiOutlineExclamationCircle size={20} />
              <p className="mt-1">Author Profile</p>
            </div>
            {user && user?.documentId == blog.author?.documentId && (
              <div className="w-full h-[1px] bg-white/30 mt-2" />
            )}
          </div>

          {user && user?.documentId == blog.author?.documentId && (
            <>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/edit-free-blog/${blog.documentId}`);
                  setIsToggle(false);
                }}
                className={`text-white/80 hover:bg-white/30 hover:text-white/90 backdrop-blur-3xl cursor-pointer text-md transition-all px-3 pt-2`}
              >
                <div className="flex items-center justify-start gap-3">
                  <FiEdit3 /> <p>Edit</p>
                </div>
                <div className="w-full h-[1px] bg-white/30 mt-2" />
              </div>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  if (setSelectedDocumentId !== undefined) {
                    setSelectedDocumentId(blog.documentId);
                  }
                  if (setShowDeletePanel !== undefined) {
                    setShowDeletePanel(true);
                  }
                  setIsToggle(false);
                }}
                className={`text-white/80 hover:bg-white/30 hover:text-white/90 backdrop-blur-3xl cursor-pointer text-md transition-all px-3 py-2`}
              >
                <div className="flex items-center justify-start gap-3">
                  <AiOutlineDelete /> <p className="mt-1">Delete</p>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
