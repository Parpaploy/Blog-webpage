"use client";

import React from "react";
import { useTranslation } from "react-i18next";

export default function TemplateDefaultPage() {
  const { t } = useTranslation("template");

  return (
    <main className="w-full min-h-[93svh] max-w-[1920px] mx-auto">
      <section>
        <h1>{t("hello")}</h1>
      </section>
    </main>
  );
}
