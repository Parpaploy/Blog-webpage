"use client";

import React, { useEffect, useState, useTransition, useRef } from "react";
import { GoSearch } from "react-icons/go";
import {
  ICategory,
  IBlog,
  ISubscribeBlog,
} from "../../../../interfaces/strapi.interface";
import { useRouter, useSearchParams } from "next/navigation";
import CategoryMenu from "./category-menu";
import { RiResetRightLine } from "react-icons/ri";
import { motion, AnimatePresence } from "framer-motion";
import { Suggestion } from "../../../../types/ui.type";
import { useTranslation } from "react-i18next";
import { BsFilter } from "react-icons/bs";

function Search({
  isOpenCat,
  setIsOpenCat,
  isHover,
  setIsHover,
  categories,
  blogs,
  subscribeBlogs,
}: {
  isOpenCat: boolean;
  setIsOpenCat: (isOpenCat: boolean) => void;
  isHover: boolean;
  setIsHover: (isHover: boolean) => void;
  categories: ICategory[];
  blogs: IBlog[];
  subscribeBlogs: ISubscribeBlog[];
}) {
  const { t } = useTranslation("navbar");

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

  const menuContainerVariants = {
    hidden: {
      opacity: 0,
      y: -10,
      transition: {
        // when: "afterChildren",
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

  const generateSuggestions = (searchQuery: string) => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const allBlogs = [...blogs, ...subscribeBlogs];
    let relevantBlogs;

    if (selectedCategories.length >= 2) {
      relevantBlogs = allBlogs.filter((blog) => {
        const blogCategoryTitles = new Set(
          blog.categories?.map((cat) => cat.title)
        );
        return selectedCategories.every((selectedCat) =>
          blogCategoryTitles.has(selectedCat)
        );
      });
    } else if (selectedCategories.length === 1) {
      relevantBlogs = allBlogs.filter((blog) =>
        blog.categories?.some((cat) => selectedCategories.includes(cat.title))
      );
    } else {
      relevantBlogs = allBlogs;
    }

    const queryLower = searchQuery.toLowerCase();
    const suggestionMap = new Map<string, Suggestion>();

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

  const updateSearchParams = (
    newQuery?: string,
    newCategories?: string[],
    type: "search" | "category" = "search"
  ) => {
    const search = new URLSearchParams();
    const finalQuery = newQuery ?? params.get("query") ?? "";
    const finalCategories = newCategories ?? params.getAll("category");
    if (finalQuery.trim() !== "") search.set("query", finalQuery);
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
    if (query.trim() === "" || isQueryUnchanged()) return;
    setShowSuggestions(false);
    updateSearchParams(query, undefined, "search");
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
    setTimeout(() => {
      setQuery("");
      setSelectedCategories([]);
      setLoadingCategories([]);
      setSuggestions([]);
      setShowSuggestions(false);
    }, 4500);
    startTransition(() => {
      router.push(`/search`);
    });
  };

  useEffect(() => {
    setIsSearching(false);
    setLoadingCategories([]);
  }, [params.toString()]);

  return (
    <div className="w-[35%] flex gap-3 h-10 relative" ref={searchContainerRef}>
      <div className="h-full flex-1 relative">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            setIsOpenCat(false);
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

      <button
        className={`flex w-10 items-center justify-center h-full transition-all bg-white/10 hover:bg-white/30 backdrop-blur-sm border border-white/30 shadow-md rounded-4xl px-2 py-1 cursor-pointer ${
          isProcessing || query.trim() === "" || isQueryUnchanged()
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

      <button
        className={`flex w-10 items-center justify-center h-full transition-all backdrop-blur-sm border border-white/30 shadow-md rounded-4xl px-2 py-1 cursor-pointer
          ${canHover ? (isOpenCat ? "" : "") : ""}
              ${
                isOpenCat
                  ? "bg-white/30 text-white/90"
                  : "bg-white/10 hover:bg-white/30 text-white/80 hover:text-white/90"
              }
                  ${!isProcessing ? "" : "opacity-60 pointer-events-none"}`}
        onClick={(e) => {
          e.currentTarget.blur();
          setShowSuggestions(false);
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
        <BsFilter size={24} />
      </button>

      <button
        onClick={handleReset}
        className={`group flex w-10 items-center justify-center h-full transition-all bg-white/10 hover:bg-white/30 backdrop-blur-sm border border-white/30 shadow-md rounded-4xl px-2 py-1 cursor-pointer ${
          !isProcessing &&
          (query.trim() !== "" || selectedCategories.length > 0)
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
