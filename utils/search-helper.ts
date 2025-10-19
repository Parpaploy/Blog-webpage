import { ICategory } from "../interfaces/strapi.interface";
import { BlogEntry } from "../types/logic.type";

const filterBlogs = (
  blogs: BlogEntry[],
  query: string,
  categories: string[],
  type: string
): BlogEntry[] => {
  const queryLower = query.toLowerCase();

  return blogs.filter((item) => {
    const matchQuery =
      !queryLower ||
      item.title?.toLowerCase().includes(queryLower) ||
      item.description?.toLowerCase().includes(queryLower) ||
      item.author?.username?.toLowerCase().includes(queryLower);

    const matchCategory =
      categories.length === 0 ||
      categories.every((selectedCat) =>
        item.categories?.some((cat: ICategory) => cat.title === selectedCat)
      );

    const matchType = type === "all" || item.type === type;

    return matchQuery && matchCategory && matchType;
  });
};

const sortBlogs = (blogs: BlogEntry[], sortBy: string): BlogEntry[] => {
  const sorted = [...blogs];

  return sorted.sort((a, b) => {
    switch (sortBy) {
      case "alphabetical":
        return a.title.localeCompare(b.title);
      case "price":
        return b.sortPrice - a.sortPrice;
      case "latest":
      default:
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }
  });
};

export const filterAndSortBlogs = (
  allBlogs: BlogEntry[],
  params: URLSearchParams
): BlogEntry[] => {
  const query = params.get("query") || "";
  const selectedCategories = params.getAll("category");
  const sortBy = params.get("sortBy") || "latest";
  const type = params.get("type") || "all";

  const filtered = filterBlogs(allBlogs, query, selectedCategories, type);

  const sorted = sortBlogs(filtered, sortBy);

  return sorted;
};
