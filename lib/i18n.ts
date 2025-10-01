import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import templateEn from "../public/locales/en/template.json";
import templateTh from "../public/locales/th/template.json";

import homeEn from "../public/locales/en/home.json";
import homeTh from "../public/locales/th/home.json";

import navbarEn from "../public/locales/en/navbar.json";
import navbarTh from "../public/locales/th/navbar.json";

import sidebarEn from "../public/locales/en/sidebar.json";
import sidebarTh from "../public/locales/th/sidebar.json";

import signupEn from "../public/locales/en/signup.json";
import signupTh from "../public/locales/th/signup.json";

import loginEn from "../public/locales/en/login.json";
import loginTh from "../public/locales/th/login.json";

import profileEn from "../public/locales/en/profile.json";
import profileTh from "../public/locales/th/profile.json";

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
      sidebar: sidebarTh,
      signup: signupTh,
      login: loginTh,
      profile: profileTh,
      blogs: blogsTh,
      subscribeBlogs: subscribeBlogsTh,
    },
    en: {
      template: templateEn,
      home: homeEn,
      navbar: navbarEn,
      sidebar: sidebarEn,
      signup: signupEn,
      login: loginEn,
      profile: profileEn,
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
