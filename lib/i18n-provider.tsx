"use client";

import { ReactNode } from "react";

import i18n from "./i18n";
import { I18nextProvider } from "react-i18next";
import { Ii18nProps } from "../interfaces/props.interface";

export default function I18nProvider({ children }: Ii18nProps) {
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
