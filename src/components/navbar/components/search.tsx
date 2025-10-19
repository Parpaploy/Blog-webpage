"use client";

import React, { useEffect, useState, useTransition, useRef } from "react";
import { GoSearch } from "react-icons/go";
import {
  ICategory,
  IBlog,
  ISubscribeBlog,
  IUser,
} from "../../../../interfaces/strapi.interface";
import { useRouter, useSearchParams } from "next/navigation";
import CategoryMenu from "./category-menu";
import { RiResetRightLine } from "react-icons/ri";
import { motion, AnimatePresence } from "framer-motion";
import { Suggestion } from "../../../../types/ui.type";
import { useTranslation } from "react-i18next";
import { BsFilter } from "react-icons/bs";
import { BiCategory } from "react-icons/bi";
import { BsSortUp, BsSortDown } from "react-icons/bs";
import { useToggle } from "../../../../hooks/toggle";
import { useSidebar } from "../../../../hooks/sidebar";

function Search({
  isOpenCat,
  setIsOpenCat,
  isHover,
  setIsHover,
  categories,
  blogs,
  subscribeBlogs,
  isOpenFilter,
  setIsOpenFilter,
  user,
  isOpen,
  onClose,
}: {
  isOpenCat: boolean;
  setIsOpenCat: (isOpenCat: boolean) => void;
  isOpenFilter: boolean;
  setIsOpenFilter: (isOpenCat: boolean) => void;
  isHover: boolean;
  setIsHover: (isHover: boolean) => void;
  categories: ICategory[];
  blogs: IBlog[];
  subscribeBlogs: ISubscribeBlog[];
  user: IUser | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  const { t } = useTranslation("navbar");

  const { isSidebar } = useSidebar();

  const { setOpenNavbar, registerBlogToggleCallback } = useToggle();

  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const params = useSearchParams();
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const urlQuery = params.get("query") || "";
  const [query, setQuery] = useState(urlQuery);

  const [isPending, startTransition] = useTransition();
  const [canHover, setCanHover] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    params.getAll("category")
  );
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  const isProcessing = isPending || isSearching || loadingCategories.length > 0;
  const isDisable = isPending || isSearching;

  const currentSort = params.get("sortBy") || "latest";
  const defaultDir = currentSort === "alphabetical" ? "asc" : "desc";
  const currentDir = params.get("sortDir") || defaultDir;

  const currentType = params.get("type") || "all";

  const sortOptions = [
    {
      key: "latest",
      asc: t("sort.latest"),
      desc: t("sort.latest"),
    },
    {
      key: "alphabetical",
      asc: t("sort.alphabetical"),
      desc: t("sort.alphabetical"),
    },
    {
      key: "price",
      asc: t("sort.price"),
      desc: t("sort.price"),
    },
  ];

  const menuContainerVariants = {
    hidden: {
      opacity: 0,
      y: -10,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.05,
      },
    },
  };

  const handleTypeChange = (type: string) => {
    setIsOpenFilter(false);

    const newParams = new URLSearchParams(params.toString());
    newParams.set("type", type);

    if (type === "blog" && newParams.get("sortBy") === "price") {
      newParams.set("sortBy", "latest");
      newParams.delete("sortDir");
    }

    startTransition(() => {
      router.push(`/search?${newParams.toString()}`);
    });
  };

  const handleSortChange = (sortKey: string) => {
    setIsOpenFilter(false);
    let newSort = sortKey;
    let newDir = "";

    if (sortKey === currentSort) {
      newDir = currentDir === "asc" ? "desc" : "asc";
    } else {
      newSort = sortKey;
      newDir = sortKey === "alphabetical" ? "asc" : "desc";
    }

    const newParams = new URLSearchParams(params.toString());
    newParams.set("sortBy", newSort);
    newParams.set("sortDir", newDir);

    startTransition(() => {
      router.push(`/search?${newParams.toString()}`);
    });
  };

  const generateSuggestions = (searchQuery: string) => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const queryLower = searchQuery.toLowerCase();
    const suggestionMap = new Map<string, Suggestion>();

    const allEntries = [
      ...blogs.map((b) => ({ ...b, type: "blog" })),
      ...subscribeBlogs.map((s) => ({ ...s, type: "subscribe" })),
    ];

    let sourceBlogs = allEntries;
    if (currentType !== "all") {
      sourceBlogs = allEntries.filter((entry) => entry.type === currentType);
    }

    const relevantBlogs =
      selectedCategories.length > 0
        ? sourceBlogs.filter((blog) => {
            const blogCategoryTitles = new Set(
              blog.categories?.map((cat) => cat.title) ?? []
            );
            return selectedCategories.every((selectedCat) =>
              blogCategoryTitles.has(selectedCat)
            );
          })
        : sourceBlogs;

    relevantBlogs.forEach((blog) => {
      if (suggestionMap.size >= 10) return;

      if (
        blog.title?.toLowerCase().includes(queryLower) &&
        !suggestionMap.has(blog.title.toLowerCase())
      ) {
        suggestionMap.set(blog.title.toLowerCase(), {
          text: blog.title,
          type: "title",
        });
      }

      if (
        blog.author?.username?.toLowerCase().includes(queryLower) &&
        !suggestionMap.has(blog.author.username.toLowerCase())
      ) {
        suggestionMap.set(blog.author.username.toLowerCase(), {
          text: blog.author.username,
          type: "author",
        });
      }

      if (blog.description?.toLowerCase().includes(queryLower)) {
        const wordsRegex = new RegExp(`\\b(\\w*${queryLower}\\w*)\\b`, "gi");
        const matches = blog.description.match(wordsRegex);
        if (matches) {
          matches.forEach((word) => {
            if (
              suggestionMap.size < 10 &&
              word.length > 2 &&
              !suggestionMap.has(word.toLowerCase())
            ) {
              suggestionMap.set(word.toLowerCase(), {
                text: word,
                type: "description",
              });
            }
          });
        }
      }
    });

    const suggestionsArray = Array.from(suggestionMap.values()).slice(0, 6);
    setSuggestions(suggestionsArray);
    setShowSuggestions(suggestionsArray.length > 0);
  };

  useEffect(() => {
    if (document.activeElement !== inputRef.current) {
      setShowSuggestions(false);
      return;
    }

    const timeoutId = setTimeout(() => {
      generateSuggestions(query);
    }, 200);
    return () => clearTimeout(timeoutId);
  }, [query, selectedCategories]);

  const handleSuggestionClick = (suggestion: Suggestion) => {
    setQuery(suggestion.text);
    setShowSuggestions(false);
    updateSearchParams(suggestion.text, selectedCategories, "search");

    inputRef.current?.blur();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    return registerBlogToggleCallback(() => {
      setIsOpenCat(false);
      setIsOpenFilter(false);
      setShowSuggestions(false);
    });
  }, [registerBlogToggleCallback, setIsOpenCat, setIsOpenFilter]);

  const updateSearchParams = (
    newQuery?: string,
    newCategories?: string[],
    type: "search" | "category" = "search"
  ) => {
    const search = new URLSearchParams(params.toString());
    const finalQuery = newQuery ?? params.get("query") ?? "";
    const finalCategories = newCategories ?? params.getAll("category");

    if (finalQuery.trim() !== "") search.set("query", finalQuery);
    else search.delete("query");

    search.delete("category");
    finalCategories.forEach((c) => search.append("category", c));

    if (type === "search") setIsSearching(true);
    router.push(`/search?${search.toString()}`);
  };

  const isQueryUnchanged = () => {
    const currentQuery = params.get("query") || "";
    const currentCategories = params.getAll("category").sort();
    const newCategories = [...selectedCategories].sort();
    return (
      query.trim() === currentQuery.trim() &&
      JSON.stringify(currentCategories) === JSON.stringify(newCategories)
    );
  };

  const handleSearch = () => {
    if (isQueryUnchanged()) return;
    setShowSuggestions(false);
    setOpenNavbar(false);

    const newParams = new URLSearchParams(params.toString());
    if (query.trim() !== "") {
      newParams.set("query", query);
    } else {
      newParams.delete("query");
    }

    newParams.delete("category");
    selectedCategories.forEach((c) => newParams.append("category", c));

    setIsSearching(true);
    router.push(`/search?${newParams.toString()}`);
  };

  const handleCategoryClick = (cat: string) => {
    const newCategories = selectedCategories.includes(cat)
      ? selectedCategories.filter((c) => c !== cat)
      : [...selectedCategories, cat];
    setSelectedCategories(newCategories);
    setLoadingCategories((prev) => [...prev, cat]);
    updateSearchParams(query, newCategories, "category");
  };

  const handleReset = () => {
    setIsOpenCat(false);
    setIsOpenFilter(false);
    setOpenNavbar(false);
    setShowSuggestions(false);

    setTimeout(() => {
      setQuery("");
      setSelectedCategories([]);
      setLoadingCategories([]);
      setSuggestions([]);
    }, 3000);
    startTransition(() => {
      router.push(`/search`);
    });
  };

  useEffect(() => {
    setIsSearching(false);
    setLoadingCategories([]);
  }, [params.toString()]);

  return (
    <div
      className={`flex gap-2 transition-all ${
        isSidebar && "lg:gap-2 md:gap-0.5"
      } h-10 relative`}
      ref={searchContainerRef}
    >
      {/* Category */}
      <button
        className={`flex w-10 items-center justify-center h-full transition-all backdrop-blur-sm border border-white/30 shadow-md rounded-4xl px-2 py-1 cursor-pointer
              ${
                isOpenCat
                  ? "bg-white/30 text-white/90"
                  : "bg-white/10 hover:bg-white/30 text-white/60 hover:text-white/80"
              }
                  ${!isProcessing ? "" : "opacity-60 pointer-events-none"}`}
        onClick={(e) => {
          e.currentTarget.blur();
          setShowSuggestions(false);
          setIsOpenFilter(false);
          setOpenNavbar(false);
          setIsOpenCat(!isOpenCat);
          setCanHover(false);
        }}
        onMouseEnter={() => canHover && setIsHover(true)}
        onMouseLeave={() => {
          setIsHover(false);
          setCanHover(true);
        }}
        onMouseUp={() => setTimeout(() => setCanHover(false), 0)}
      >
        <BiCategory size={24} />
      </button>

      {/* Input */}
      <div className="2xl:min-w-100 xl:min-w-90 lg:min-w-70 md:min-w-30 h-full flex-1 relative">
        <input
          ref={inputRef}
          type="text"
          placeholder={t("searchPlaceholder")}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            setIsOpenCat(false);
            setIsOpenFilter(false);
            setOpenNavbar(false);
            if (query.trim().length >= 2 && suggestions.length > 0) {
              setShowSuggestions(true);
            }
          }}
          className={`w-full h-full bg-white/10 backdrop-blur-sm border border-white/30 shadow-md rounded-4xl px-4 py-1 focus:ring-2 focus:ring-white/30 focus:outline-none ${
            isPending ? "opacity-60 pointer-events-none" : ""
          }`}
          onKeyDown={(e) => {
            if (!isProcessing && e.key === "Enter") {
              handleSearch();
            }
          }}
        />
        <AnimatePresence>
          {showSuggestions && suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 right-0 mt-1 bg-white/10 backdrop-blur-md border border-white/30 rounded-2xl shadow-md overflow-hidden z-50"
            >
              <div>
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className={`px-4 py-2.5 transition-all duration-150 flex items-center justify-between gap-3 ${
                      suggestion.text.toLowerCase() === urlQuery.toLowerCase()
                        ? "bg-white/30 pointer-events-none"
                        : "bg-transparent hover:bg-white/20 cursor-pointer"
                    }`}
                    onClick={() => {
                      handleSuggestionClick(suggestion);
                      setShowSuggestions(false);
                    }}
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <GoSearch
                        size={16}
                        className="text-white/60 flex-shrink-0"
                      />
                      <span className="text-white/90 text-sm truncate">
                        {suggestion.text}
                      </span>
                    </div>
                    {suggestion.type === "title" && (
                      <span className="text-xs text-white/90 bg-white/30 px-2 py-0.5 rounded-full flex-shrink-0">
                        {t("from")} {t("title")}
                      </span>
                    )}
                    {suggestion.type === "author" && (
                      <span className="text-xs text-white/90 bg-white/30 px-2 py-0.5 rounded-full flex-shrink-0">
                        {t("from")} {t("author")}
                      </span>
                    )}
                    {suggestion.type === "description" && (
                      <span className="text-xs text-white/90 bg-white/30 px-2 py-0.5 rounded-full flex-shrink-0">
                        {t("from")} {t("desc")}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Search */}
      <button
        className={`flex w-10 items-center justify-center h-full transition-all bg-white/10 hover:bg-white/30 backdrop-blur-sm border border-white/30 shadow-md rounded-4xl px-2 py-1 cursor-pointer ${
          isProcessing || isQueryUnchanged()
            ? "opacity-60 pointer-events-none"
            : ""
        }`}
        onClick={handleSearch}
      >
        {isSearching ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <GoSearch size={20} />
        )}
      </button>

      {/* Filter */}
      <div className="relative">
        <button
          className={`flex w-10 items-center justify-center h-full transition-all backdrop-blur-sm border border-white/30 shadow-md rounded-4xl px-2 py-1 cursor-pointer
                ${
                  isOpenFilter
                    ? "bg-white/30 text-white/90"
                    : "bg-white/10 hover:bg-white/30 text-white/80 hover:text-white/90"
                }
                    ${!isProcessing ? "" : "opacity-60 pointer-events-none"}`}
          onClick={(e) => {
            e.currentTarget.blur();
            setShowSuggestions(false);
            setIsOpenCat(false);
            setOpenNavbar(false);
            setIsOpenFilter(!isOpenFilter);
            setCanHover(false);
          }}
        >
          <BsFilter size={24} />
        </button>

        <AnimatePresence>
          {isOpenFilter && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-12 right-0 w-60 h-fit bg-white/20 backdrop-blur-sm border border-white/30 shadow-md rounded-lg overflow-hidden z-50"
            >
              <div className="p-3 border-b border-white/30">
                <div className="flex items-center justify-between gap-2">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="blogType"
                      value="all"
                      checked={currentType === "all"}
                      onChange={() => handleTypeChange("all")}
                      disabled={isDisable}
                      className="cursor-pointer checked:cursor-default appearance-none h-3 w-3 mb-1 border border-white/40 rounded-full bg-white/20 checked:bg-white/90 focus:outline-none focus:ring-0 transition-all duration-200"
                    />
                    <span className="text-sm text-white/90">
                      {t("filter.all")}
                    </span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="blogType"
                      value="blog"
                      checked={currentType === "blog"}
                      onChange={() => handleTypeChange("blog")}
                      disabled={isDisable}
                      className="cursor-pointer checked:cursor-default appearance-none h-3 w-3 mb-1 border border-white/40 rounded-full bg-white/20 checked:bg-white/80 focus:outline-none focus:ring-0 transition-all duration-200"
                    />
                    <span className="text-sm text-white/90">
                      {t("filter.free")}
                    </span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="blogType"
                      value="subscribe"
                      checked={currentType === "subscribe"}
                      onChange={() => handleTypeChange("subscribe")}
                      disabled={isDisable}
                      className="cursor-pointer checked:cursor-default appearance-none h-3 w-3 mb-1 border border-white/40 rounded-full bg-white/20 checked:bg-white/90 focus:outline-none focus:ring-0 transition-all duration-200"
                    />
                    <span className="text-sm text-white/90">
                      {t("filter.subscribe")}
                    </span>
                  </label>
                </div>
              </div>

              {sortOptions.map((option, index) => {
                const isActive = currentSort === option.key;
                const isDisabled =
                  option.key === "price" && currentType === "blog";
                const label = isActive
                  ? currentDir === "asc"
                    ? option.asc
                    : option.desc
                  : option.key === "alphabetical"
                  ? option.asc
                  : option.desc;

                return (
                  <div
                    key={option.key}
                    onClick={() => !isDisabled && handleSortChange(option.key)}
                    className={`text-md transition-all px-3 py-2.5 flex items-center justify-between ${
                      isDisabled
                        ? "text-white/40 bg-white/10 cursor-not-allowed"
                        : isActive
                        ? "text-white bg-white/40 font-semibold cursor-pointer"
                        : "text-white/80 hover:bg-white/30 hover:text-white/90 cursor-pointer"
                    } ${
                      index < sortOptions.length - 1
                        ? "border-b border-white/30"
                        : ""
                    }`}
                  >
                    <span>{label}</span>

                    {isActive && !isDisabled && (
                      <span className="ml-2">
                        {currentDir === "asc" ? (
                          <BsSortUp size={18} />
                        ) : (
                          <BsSortDown size={18} />
                        )}
                      </span>
                    )}
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Reset */}
      <button
        onClick={handleReset}
        className={`group flex w-10 items-center justify-center h-full transition-all bg-white/10 hover:bg-white/30 backdrop-blur-sm border border-white/30 shadow-md rounded-4xl px-2 py-1 cursor-pointer ${
          !isProcessing &&
          (query.trim() !== "" ||
            selectedCategories.length > 0 ||
            params.get("sortBy") ||
            params.get("type"))
            ? ""
            : "opacity-60 pointer-events-none"
        }`}
      >
        <RiResetRightLine
          size={20}
          className={`${
            isPending
              ? "animate-spin-smooth"
              : "group-hover:rotate-360 transition-transform duration-500"
          }`}
        />
      </button>

      <div
        className={`w-full flex flex-wrap gap-3 items-center justify-center absolute top-14 left-1/2 -translate-x-1/2 transition-all duration-300 `}
      >
        <AnimatePresence>
          {isOpenCat && (
            <motion.div
              key="category-menu-container"
              variants={menuContainerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="py-3 w-full flex flex-wrap gap-3 items-center justify-center bg-white/10 backdrop-blur-md border border-white/30 rounded-4xl shadow-md"
            >
              {categories.map((cat: ICategory) => (
                <CategoryMenu
                  key={cat.title}
                  title={cat.title}
                  handleCategoryClick={handleCategoryClick}
                  catTitle={cat.title}
                  selectedCategories={selectedCategories}
                  loadingCategories={loadingCategories}
                  isDisable={isDisable}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default Search;
