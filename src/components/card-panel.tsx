"use client";

import React from "react";
import { FiEdit3 } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";
import { HiOutlineExclamationCircle } from "react-icons/hi2";
import { motion, AnimatePresence } from "framer-motion";
import {
  IBlog,
  ISubscribeBlog,
  IUser,
} from "../../interfaces/strapi.interface";
import { useSidebar } from "../../hooks/sidebar";

export default function CardPanel({
  blog,
  user,
  isToggle,
  setOpenBlogId,
  setShowDeletePanel,
  setSelectedDocumentId,
  goToUserBlogs,
  router,
  t,
  isSmall = false,
  isSub,
}: {
  blog: IBlog | ISubscribeBlog;
  user: IUser | null;
  isToggle: boolean;
  setOpenBlogId: (id: string | null) => void;
  setShowDeletePanel?: (show: boolean) => void;
  setSelectedDocumentId?: (id: string) => void;
  goToUserBlogs: (e: React.MouseEvent) => void;
  router: any;
  t: any;
  isSmall?: boolean;
  isSub: boolean;
}) {
  const { isSidebar } = useSidebar();

  const buttonBaseClasses =
    "text-white/80 hover:bg-white/30 hover:text-white/90 backdrop-blur-3xl cursor-pointer transition-all px-3";

  const innerFlexClasses = "flex items-center justify-start gap-2";

  const divider = (
    <div className="flex justify-center backdrop-blur-3xl">
      <div className="w-[90%] h-[1px] bg-white/30" />
    </div>
  );

  const isAuthor = user && user?.documentId == blog.author?.documentId;

  return (
    <AnimatePresence>
      {isToggle && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
          className={`absolute ${
            isSmall
              ? `lg:overflow-y-auto scrollbar-hide xl:bottom-10 lg:bottom-8 md:bottom-10 bottom-7 right-2 ${
                  !isAuthor
                    ? "h-fit"
                    : `${
                        isSidebar
                          ? "2xl:w-58.5 xl:w-40 lg:w-38 md:w-[75%] w-[60%] 2xl:h-32.5 xl:h-22.5 lg:h-19.5 md:h-22.5 h-20.5"
                          : "2xl:w-65 xl:w-46.5 lg:w-45 md:w-[70%] w-[60%] 2xl:h-37.5 xl:h-27.5 lg:h-24 md:h-22.5 h-20.5"
                      }`
                }`
              : "md:bottom-10 bottom-7 right-2 2xl:w-55 xl:w-45 md:w-40 w-[70%] 2xl:h-40 xl:h-35 md:h-28 h-22"
          } bg-black/50 backdrop-blur-sm backdrop-brightness-200 border border-white/30 shadow-md rounded-lg overflow-hidden z-50 flex flex-col`}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            onClick={(e) => {
              e.stopPropagation();
              goToUserBlogs(e);
              setOpenBlogId(null);
            }}
            className={`${buttonBaseClasses} ${
              isAuthor ? "flex-1 flex items-center" : "py-2.5"
            }`}
          >
            <div className={innerFlexClasses}>
              <HiOutlineExclamationCircle
                className={`${
                  isSmall
                    ? `${
                        isSidebar
                          ? "2xl:text-[24px] xl:text-[22px] lg:text-[20px] md:text-[22px] text-[18px]"
                          : "2xl:text-[28px] xl:text-[24px] md:text-[22px] text-[18px]"
                      }`
                    : "2xl:text-[28px] xl:text-[26px] md:text-[22px] text-[16px]"
                }`}
              />
              <p
                className={`${
                  isSmall
                    ? `${
                        isSidebar
                          ? "2xl:text-[16px] xl:text-[14px] md:text-[14px] text-[12px]"
                          : "2xl:text-[18px] xl:text-[15px] md:text-[14px] text-[12px]"
                      }`
                    : "md:text-[16px] text-xs"
                } mt-0.5`}
              >
                {t("author_profile")}
              </p>
            </div>
          </div>

          {isAuthor && (
            <>
              {divider}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  if (isSub) {
                    router.push(`/edit-subscribe-blog/${blog.documentId}`);
                  } else {
                    router.push(`/edit-free-blog/${blog.documentId}`);
                  }
                  setOpenBlogId(null);
                }}
                className={`${buttonBaseClasses} flex-1 flex items-center`}
              >
                <div className={innerFlexClasses}>
                  <FiEdit3
                    className={`${
                      isSmall
                        ? `${
                            isSidebar
                              ? "2xl:text-[22px] xl:text-[19px] lg:text-[19px] md:text-[20px] text-[17px]"
                              : "2xl:text-[24px] xl:text-[20px] md:text-[19px] text-[17px]"
                          }`
                        : "2xl:text-[22px] xl:text-[20px] lg:text-[17px] md:text-[18px] text-[12px]"
                    } mb-0.5`}
                  />
                  <p
                    className={`${
                      isSmall
                        ? `${
                            isSidebar
                              ? "2xl:text-[16px] xl:text-[14px] md:text-[14px] text-[12px]"
                              : "2xl:text-[18px] xl:text-[15px] md:text-[14px] text-[12px]"
                          }`
                        : "md:text-[16px] text-xs"
                    } mt-0.5`}
                  >
                    {t("edit")}
                  </p>
                </div>
              </div>
              {divider}

              <div
                onClick={(e) => {
                  e.stopPropagation();
                  if (setSelectedDocumentId) {
                    setSelectedDocumentId(blog.documentId);
                  }
                  if (setShowDeletePanel) {
                    setShowDeletePanel(true);
                  }
                  setOpenBlogId(null);
                }}
                className={`${buttonBaseClasses} flex-1 flex items-center`}
              >
                <div className={innerFlexClasses}>
                  <AiOutlineDelete
                    className={`${
                      isSmall
                        ? `${
                            isSidebar
                              ? "2xl:text-[22px] xl:text-[19px] lg:text-[19px] md:text-[20px] text-[17px]"
                              : "2xl:text-[24px] xl:text-[20px] md:text-[19px] text-[17px]"
                          }`
                        : "2xl:text-[22px] xl:text-[20px] lg:text-[17px] md:text-[18px] text-[12px]"
                    } mb-0.5`}
                  />
                  <p
                    className={`${
                      isSmall
                        ? `${
                            isSidebar
                              ? "2xl:text-[16px] xl:text-[14px] md:text-[14px] text-[12px]"
                              : "2xl:text-[18px] xl:text-[15px] md:text-[14px] text-[12px]"
                          }`
                        : "md:text-[16px] text-xs"
                    }`}
                  >
                    {t("delete")}
                  </p>
                </div>
              </div>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
