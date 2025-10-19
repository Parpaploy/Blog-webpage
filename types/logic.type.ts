import { IBlog, ISubscribeBlog } from "../interfaces/strapi.interface";

export type BlogEntryFree = IBlog & {
  type: "blog";
  sortPrice: number;
};

export type BlogEntryPaid = ISubscribeBlog & {
  type: "subscribe";
  sortPrice: number;
};

export type BlogEntry = BlogEntryFree | BlogEntryPaid;

export type SetStateAction<T> = T | ((prev: T) => T);
