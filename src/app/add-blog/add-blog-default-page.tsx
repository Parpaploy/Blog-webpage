"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSidebar } from "../../../hooks/sidebar";
import RichTextEditor from "@/components/rich-text-editor";

export default function AddBlogDefaultPage() {
  const { t } = useTranslation("addBlog");
  const { isSidebar } = useSidebar();

  const [post, setPost] = useState("");

  const onChange = (content: string) => {
    setPost(content);
    console.log(content);
  };

  return (
    <main
      className={`w-full h-full overflow-y-auto 2xl:pt-[7svh] xl:pt-[9svh] lg:pt-[8svh] md:pt-[5svh] ${
        isSidebar ? "pl-65" : "pl-25"
      } transition-all text-white`}
    >
      <section className="max-w-3xl mx-auto">
        <h1>{t("hello")}</h1>
        <RichTextEditor content={post} onChange={onChange} />
      </section>
    </main>
  );
}
