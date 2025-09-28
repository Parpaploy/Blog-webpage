"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { useSidebar } from "../../hooks/sidebar";

export default function TemplateDefaultPage() {
  const { t } = useTranslation("template");

  const { isSidebar } = useSidebar();

  return (
    <main
      className={`w-full h-full ${
        isSidebar ? "pl-65" : "pl-25"
      } transition-all`}
    >
      <section>
        <h1>{t("hello")}</h1>
      </section>
    </main>
  );
}
