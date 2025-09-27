"use client";

import { ReactNode } from "react";

import i18n from "./i18n";
import { I18nextProvider } from "react-i18next";

interface Props {
  children: ReactNode;
}

export default function I18nProvider({ children }: Props) {
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
