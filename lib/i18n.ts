import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import templateEn from "../public/locales/en/template.json";
import templateTh from "../public/locales/th/template.json";

import homeEn from "../public/locales/en/home.json";
import homeTh from "../public/locales/th/home.json";

import navbarEn from "../public/locales/en/navbar.json";
import navbarTh from "../public/locales/th/navbar.json";

import loginEn from "../public/locales/en/login.json";
import loginTh from "../public/locales/th/login.json";

import blogsEn from "../public/locales/en/blogs.json";
import blogsTh from "../public/locales/th/blogs.json";

import subscribeBlogsEn from "../public/locales/en/subscribe-blogs.json";
import subscribeBlogsTh from "../public/locales/th/subscribe-blogs.json";

i18n.use(initReactI18next).init({
  resources: {
    th: {
      template: templateTh,
      home: homeTh,
      navbar: navbarTh,
      login: loginTh,
      blogs: blogsTh,
      subscribeBlogs: subscribeBlogsTh,
    },
    en: {
      template: templateEn,
      home: homeEn,
      navbar: navbarEn,
      login: loginEn,
      blogs: blogsEn,
      subscribeBlogs: subscribeBlogsEn,
    },
  },
  lng: "th",
  fallbackLng: "en",
  defaultNS: "home",
  interpolation: { escapeValue: false },
});

export default i18n;
