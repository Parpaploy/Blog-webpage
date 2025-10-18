import { IBlog, ISubscribeBlog } from "../interfaces/strapi.interface";

type BlogEntryFree = IBlog & {
  type: "blog";
  sortPrice: number;
};

type BlogEntryPaid = ISubscribeBlog & {
  type: "subscribe";
  sortPrice: number;
};

export type BlogEntry = BlogEntryFree | BlogEntryPaid;
