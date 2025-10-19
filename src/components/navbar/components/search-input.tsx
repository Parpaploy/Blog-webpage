"use client";

import React, { useState, useEffect, useRef } from "react";
import { GoSearch } from "react-icons/go";
import { motion, AnimatePresence } from "framer-motion";
import { Suggestion } from "../../../../types/ui.type";
import { IBlog, ISubscribeBlog } from "../../../../interfaces/strapi.interface";

type BlogEntry = (IBlog | ISubscribeBlog) & { type: "blog" | "subscribe" };

interface SearchInputProps {
  urlQuery: string;
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  isPending: boolean;
  isProcessing: boolean;
  t: (key: string) => string;
  allBlogs: BlogEntry[];
  selectedCategories: string[];
  currentType: string;
  onSearch: () => void;
  onFocus: () => void;
  onSuggestionClick: (suggestion: Suggestion) => void;
}

export default function SearchInput({
  urlQuery,
  query,
  setQuery,
  isPending,
  isProcessing,
  t,
  allBlogs,
  selectedCategories,
  currentType,
  onSearch,
  onFocus,
  onSuggestionClick,
}: SearchInputProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const generateSuggestions = (searchQuery: string) => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    const queryLower = searchQuery.toLowerCase();
    const suggestionMap = new Map<string, Suggestion>();

    let sourceBlogs = allBlogs;
    if (currentType !== "all") {
      sourceBlogs = allBlogs.filter((entry) => entry.type === currentType);
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
  }, [query, selectedCategories, currentType, allBlogs]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.parentElement?.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLocalSuggestionClick = (suggestion: Suggestion) => {
    setQuery(suggestion.text);
    setShowSuggestions(false);
    inputRef.current?.blur();
    onSuggestionClick(suggestion);
  };

  return (
    <div className="2xl:min-w-100 xl:min-w-90 lg:min-w-70 md:min-w-30 h-full flex-1 relative">
      <input
        ref={inputRef}
        type="text"
        placeholder={t("searchPlaceholder")}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => {
          onFocus();
          if (query.trim().length >= 2 && suggestions.length > 0) {
            setShowSuggestions(true);
          }
        }}
        className={`w-full h-full bg-white/10 backdrop-blur-sm border border-white/30 shadow-md rounded-4xl px-4 py-1 focus:ring-2 focus:ring-white/30 focus:outline-none ${
          isPending ? "opacity-60 pointer-events-none" : ""
        }`}
        onKeyDown={(e) => {
          if (!isProcessing && e.key === "Enter") {
            onSearch();
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
                  onClick={() => handleLocalSuggestionClick(suggestion)}
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
  );
}
