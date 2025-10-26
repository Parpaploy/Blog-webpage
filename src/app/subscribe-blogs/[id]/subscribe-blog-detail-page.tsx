"use client";

import React, { useEffect, useRef, useState, useTransition } from "react";
import { ISubscribeBlog, IUser } from "../../../../interfaces/strapi.interface";
import { FormatDate } from "../../../../utils/format-date";
import { FormatRichText } from "../../../../utils/format-rich-text";
import { useTranslation } from "react-i18next";
import { useSidebar } from "../../../../hooks/sidebar";
import SmallSubscribeBlogCard from "@/components/subscribe-blogs/small-subscribe-blog-card";
import GlobalLoading from "@/app/loading";
import { FaStar } from "react-icons/fa";
import { FiMoreHorizontal } from "react-icons/fi";
import { useToggle } from "../../../../hooks/toggle";
import DetailPanel from "@/components/detail-panel";
import { useRouter } from "next/navigation";
import DeleteSubscribeBlogPanel from "@/components/delete-subscribe-blog-panel";
import { deleteSubscribeBlog } from "../../../../lib/apis/blog-uploader";
import {
  IoIosArrowDown,
  IoIosArrowUp,
  IoIosArrowBack,
  IoIosArrowForward,
} from "react-icons/io";

export default function SubscribeBlogDetailPage({
  subBlog,
  subBlogs,
  subBlogUser,
  user,
  token,
}: {
  subBlog: ISubscribeBlog;
  subBlogs: ISubscribeBlog[];
  subBlogUser: ISubscribeBlog;
  user: IUser | null;
  token: string | undefined;
}) {
  const { t } = useTranslation("subscribeBlogs");

  const { isSidebar } = useSidebar();

  const { openBlogId, setOpenBlogId, registerRef } = useToggle();

  const panelRef = useRef<HTMLButtonElement>(null);
  const isToggle = openBlogId === subBlog.documentId;

  const [isOpen, setIsOpen] = useState<boolean>(true);

  useEffect(() => {
    if (panelRef.current) {
      registerRef(panelRef.current, "blog", subBlog.documentId);
    }
  }, [registerRef, subBlog.documentId]);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenBlogId(isToggle ? null : subBlog.documentId);
  };

  const router = useRouter();

  const [showDeletePanel, setShowDeletePanel] = useState(false);

  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(
    null
  );

  const [isPending, startTransition] = useTransition();

  const [subscribeDeleteStatus, setSubscribeDeleteStatus] = useState<
    "confirm" | "deleting" | "success" | "error"
  >("confirm");
  const [deleteError, setDeleteError] = useState<string>("");

  const goToUserBlogs = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (user?.id !== subBlog.author?.id) {
      router.push(`/user-blogs/${subBlog.author?.id}`);
    } else {
      router.push("/your-blogs");
    }
  };

  const handleDeleteSubscribeConfirm = async () => {
    const docId = selectedDocumentId || subBlog.documentId;
    if (!docId || !token) return;

    setSubscribeDeleteStatus("deleting");
    const result = await deleteSubscribeBlog(docId, token);
    if (result.success) {
      setSubscribeDeleteStatus("success");
    } else {
      setSubscribeDeleteStatus("error");
      setDeleteError(result.error || "Failed to delete blog");
    }
  };

  const handleSubscribeDeleteSuccess = () => {
    startTransition(() => {
      setTimeout(() => {
        router.refresh();
      }, 500);
    });
  };

  const handleSubscribeDeleteCancel = () => {
    setShowDeletePanel(false);
    setSubscribeDeleteStatus("confirm");
    setSelectedDocumentId(null);
    setDeleteError("");
  };

  const authorBlogs = subBlog?.author?.id
    ? subBlogs.filter(
        (b) =>
          b.author?.id &&
          b.author.id === subBlog.author.id &&
          b.documentId !== subBlog.documentId
      )
    : [];

  if (!subBlog) {
    return (
      <div className="w-screen h-full flex items-center justify-center text-white">
        <GlobalLoading />
      </div>
    );
  }

  return (
    <main
      className={`md:w-full w-screen h-full flex lg:flex-row flex-col text-white ${
        isSidebar ? "md:pl-65" : "md:pl-25"
      } px-3 md:px-0 transition-all duration-300 md:pb-0 pb-15`}
    >
      {/* Detail */}
      <section
        className={`${
          isOpen
            ? "lg:w-[70%] md:w-full w-full lg:h-full md:h-[70%] h-[60%]"
            : "w-full h-full"
        } overflow-x-hidden overflow-y-auto md:pl-0 lg:mb-0 mb-3 scrollbar-hide transition-all duration-300`}
      >
        <div className="before:block 2xl:before:h-[7svh] xl:before:h-[9svh] lg:before:h-[8svh] md:before:h-[6svh] before:h-[2svh] before:content-['']" />
        <div className="w-full flex justify-between items-start mb-5">
          <div className="w-fit flex gap-5 justify-start items-center">
            <div className="w-full max-w-[99%] text-start">
              <div className="flex justify-start items-start gap-3">
                <h1 className="whitespace-normal md:text-4xl text-xl font-bold">
                  {subBlog?.title}
                </h1>

                <div className="rounded-full bg-amber-300/50 border-1 border-white/30 md:p-4 p-2.5 md:mt-0 mt-1.5 backdrop-blur-sm shadow-md">
                  <FaStar className="md:w-5 w-3 md:h-5 h-3 text-[#424EDD]/50 absolute top-[calc(50%-1px)] -translate-y-1/2 left-1/2 -translate-x-1/2 z-20" />
                  <FaStar className="md:w-6 w-4 md:h-6 h-4 text-white/30 absolute top-[calc(50%-1px)] -translate-y-1/2 left-1/2 -translate-x-1/2 z-10" />
                </div>
              </div>
              <p className="text-[#cfcfcf]">{subBlog?.description}</p>
            </div>
          </div>

          <div className="w-fit relative">
            <button
              ref={panelRef}
              onClick={handleToggle}
              className={`${
                isToggle
                  ? "bg-black/70 text-white/90"
                  : "bg-black/50 hover:bg-black/70 text-white/80 hover:text-white/90"
              } rounded-full border border-white/30 md:p-1 p-0.5 md:text-2xl md:mt-0 mt-1.5 text-md backdrop-blur-sm backdrop-brightness-200 transition-all 
          cursor-pointer`}
            >
              <FiMoreHorizontal />

              <DetailPanel
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
            </button>
          </div>
        </div>
        <div
          className={`w-full ${
            isSidebar ? "md:h-80" : "md:h-110"
          } h-60 rounded-2xl overflow-hidden transition-all duration-300`}
        >
          <img
            className="w-full h-full object-cover"
            src={
              subBlog.thumbnail?.formats?.large?.url
                ? `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${subBlog.thumbnail.formats.large?.url}`
                : "https://mom-neuroscience.com/wp-content/uploads/2021/06/no-image.jpg"
            }
          />
        </div>
        <div className="w-full flex justify-between items-start my-3">
          <div className="w-full flex justify-start items-center gap-3">
            <div className="w-8 h-8 rounded-full overflow-hidden">
              <img
                className="w-full h-full object-cover"
                src={
                  subBlogUser.author?.profile?.formats?.small?.url
                    ? `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${subBlogUser.author.profile.formats.small.url}`
                    : "https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1906669723.jpg"
                }
              />
            </div>

            <p className="text-xl font-semibold">{subBlog.author?.username}</p>
          </div>

          <div className="w-full text-end">
            <p className="text-sm text-white/50">
              {FormatDate(subBlog?.publishedAt)}
            </p>
          </div>
        </div>
        {FormatRichText(subBlog?.detail)}
      </section>

      <div className="lg:w-[1px] w-full bg-white/30 lg:h-[95%] h-[1px] lg:mb-0 mb-3 lg:ml-8.5 self-center" />

      {/* Other blogs */}
      <section
        className={`transition-all duration-300 ${
          isOpen
            ? "lg:w-[30%] w-full lg:h-full md:h-[30%] h-[40%]"
            : "lg:w-fit w-full lg:h-full md:h-fit h-fit mb-2"
        } flex flex-col lg:pl-8 md:pl-0 2xl:pt-[7svh] xl:pt-[9svh] lg:pt-[8svh] pt-0`}
      >
        <div className="flex justify-start items-center gap-2 md:text-3xl text-xl font-bold text-start mb-3 cursor-pointer w-fit">
          <div
            className="tetx-xl lg:block hidden"
            onClick={() => {
              setIsOpen(!isOpen);
            }}
          >
            {isOpen ? <IoIosArrowForward /> : <IoIosArrowBack />}
          </div>
          <div
            className={`${!isOpen && "lg:hidden"}`}
            onClick={() => {
              if (user?.id !== subBlog.author?.id) {
                router.push(`/user-blogs/${subBlog.author?.id}`);
              } else {
                router.push("/your-blogs");
              }
            }}
          >
            {t("more", { username: subBlog.author?.username })}
          </div>

          <div
            className="tetx-xl lg:hidden block"
            onClick={() => {
              setIsOpen(!isOpen);
            }}
          >
            {isOpen ? <IoIosArrowDown /> : <IoIosArrowUp />}
          </div>
        </div>
        <div
          className="tetx-xl lg:hidden block"
          onClick={() => {
            setIsOpen(!isOpen);
          }}
        ></div>

        <div className="w-full h-full flex lg:flex-col flex-row items-start justify-start gap-5 lg:overflow-x-hidden lg:overflow-y-auto overflow-y-hidden overflow-x-auto scrollbar-hide pb-3">
          {isOpen && (
            <>
              {authorBlogs.length > 0 ? (
                <div className="w-full h-full flex lg:flex-col flex-row items-start justify-start gap-5 lg:overflow-x-hidden lg:overflow-y-auto overflow-y-hidden overflow-x-auto scrollbar-hide pb-3">
                  {authorBlogs.map((authorBlog) => {
                    return (
                      <SmallSubscribeBlogCard
                        key={authorBlog.id}
                        subBlog={authorBlog}
                        user={user}
                      />
                    );
                  })}
                </div>
              ) : (
                <div className="w-full min-h-full flex justify-center items-center text-white/50 text-sm text-center">
                  {t("no_more")}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {showDeletePanel && (
        <DeleteSubscribeBlogPanel
          onCancel={handleSubscribeDeleteCancel}
          onConfirm={handleDeleteSubscribeConfirm}
          status={subscribeDeleteStatus}
          error={deleteError}
          onSuccess={handleSubscribeDeleteSuccess}
          isRefreshing={isPending}
        />
      )}
    </main>
  );
}
