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
}) {
  return (
    <AnimatePresence>
      {isToggle && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
          className="absolute bottom-10 right-2 w-60 h-fit bg-black/50 backdrop-blur-sm backdrop-brightness-200 border border-white/30 shadow-md rounded-lg overflow-hidden z-50"
          onClick={(e) => e.stopPropagation()}
        >
          <div
            onClick={(e) => {
              e.stopPropagation();
              goToUserBlogs(e);
              setOpenBlogId(null);
            }}
            className={`text-white/80 hover:bg-white/30 hover:text-white/90 backdrop-blur-3xl cursor-pointer text-md transition-all px-3 pt-2`}
          >
            <div
              className={`flex items-center justify-start gap-3 ${
                user?.documentId != blog.author?.documentId && "pb-2"
              }`}
            >
              <HiOutlineExclamationCircle size={20} />
              <p className="mt-1">{t("author_profile")}</p>
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
                  setOpenBlogId(null);
                }}
                className={`text-white/80 hover:bg-white/30 hover:text-white/90 backdrop-blur-3xl cursor-pointer text-md transition-all px-3 pt-2`}
              >
                <div className="flex items-center justify-start gap-3 py-1">
                  <FiEdit3 /> <p>{t("edit")}</p>
                </div>
                <div className="w-full h-[1px] bg-white/30 mt-2" />
              </div>
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
                className={`text-white/80 hover:bg-white/30 hover:text-white/90 backdrop-blur-3xl cursor-pointer text-md transition-all px-3 py-2`}
              >
                <div className="flex items-center justify-start gap-3 pb-1">
                  <AiOutlineDelete /> <p className="mt-1">{t("delete")}</p>
                </div>
              </div>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
