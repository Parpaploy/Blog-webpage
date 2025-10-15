"use client";

import React, { useEffect, useState, useTransition } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { GoSearch } from "react-icons/go";
import { ICategory } from "../../../../interfaces/strapi.interface";
import { useRouter, useSearchParams } from "next/navigation";
import CategoryMenu from "./category-menu";
import { RiResetRightLine } from "react-icons/ri";
import { motion, AnimatePresence } from "framer-motion";

function Search({
  isOpenCat,
  setIsOpenCat,
  isHover,
  setIsHover,
  categories,
}: {
  isOpenCat: boolean;
  setIsOpenCat: (isOpenCat: boolean) => void;
  isHover: boolean;
  setIsHover: (isHover: boolean) => void;
  categories: ICategory[];
}) {
  const router = useRouter();
  const params = useSearchParams();

  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState(params.get("query") || "");
  const [canHover, setCanHover] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    params.getAll("category")
  );

  const isProcessing = isPending || isSearching || loadingCategories.length > 0;
  const isDisable = isPending || isSearching;

  const menuContainerVariants = {
    hidden: {
      opacity: 0,
      transition: {
        when: "afterChildren",
        staggerChildren: 0.1,
        staggerDirection: -1,
      },
    },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

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
    <div className="w-[35%] flex gap-3 h-10 relative">
      <div
        className={`flex w-10 items-center justify-center h-full transition-all backdrop-blur-sm border border-white/30 shadow-lg rounded-4xl px-2 py-1 cursor-pointer
          ${canHover ? (isOpenCat ? "" : "") : ""}
              ${
                isOpenCat
                  ? "bg-white/30 text-white/90"
                  : "bg-white/10 hover:bg-white/30 text-white/80 hover:text-white/90"
              }`}
        onClick={(e) => {
          e.currentTarget.blur();
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
        {isOpenCat ? <IoIosArrowUp size={24} /> : <IoIosArrowDown size={24} />}
      </div>

      <div className="h-full flex-1">
        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={`w-full h-full bg-white/10 backdrop-blur-sm border border-white/30 shadow-lg rounded-4xl px-4 py-1 focus:ring-2 focus:ring-white/30 focus:outline-none  ${
            isPending ? "opacity-60 pointer-events-none" : ""
          }`}
          onKeyDown={(e) => {
            if (!isProcessing && e.key === "Enter") handleSearch();
          }}
        />
      </div>

      <div
        className={`flex w-12 items-center justify-center h-full transition-all bg-white/10 hover:bg-white/30 backdrop-blur-sm border border-white/30 shadow-lg rounded-4xl px-2 py-1 cursor-pointer ${
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
      </div>

      <button
        onClick={handleReset}
        className={`group flex w-10 items-center justify-center h-full transition-all bg-white/10 hover:bg-white/30 backdrop-blur-sm border border-white/30 shadow-lg rounded-4xl px-2 py-1 cursor-pointer ${
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
        className={`w-full flex flex-wrap gap-3 items-center justify-center absolute top-14 left-1/2 -translate-x-1/2 transition-all duration-300
          ${
            isHover && canHover
              ? "-translate-y-1 opacity-50 pointer-events-none"
              : "translate-y-0 opacity-100"
          }`}
      >
        <AnimatePresence>
          {isOpenCat && (
            <motion.div
              key="category-menu-container"
              variants={menuContainerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="w-full flex flex-wrap gap-3 items-center justify-center"
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
