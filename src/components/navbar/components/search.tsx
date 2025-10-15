"use client";

import React, { useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { GoSearch } from "react-icons/go";
import { ICategory } from "../../../../interfaces/strapi.interface";
import { useRouter, useSearchParams } from "next/navigation";
import CategoryMenu from "./category-menu";
import { RiResetRightLine } from "react-icons/ri";

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

  const [query, setQuery] = useState(params.get("query") || "");
  const [canHover, setCanHover] = useState(true);

  const updateSearchParams = (newQuery?: string, newCategories?: string[]) => {
    const search = new URLSearchParams();
    const finalQuery = newQuery ?? params.get("query") ?? "";
    const finalCategories = newCategories ?? params.getAll("category");

    if (finalQuery.trim() !== "") search.set("query", finalQuery);
    finalCategories.forEach((c) => search.append("category", c));

    router.push(`/search?${search.toString()}`);
  };

  const handleSearch = () => {
    updateSearchParams(query);
  };

  const handleCategoryClick = (cat: string) => {
    const currentCategories = params.getAll("category");
    const newCategories = currentCategories.includes(cat)
      ? currentCategories.filter((c) => c !== cat)
      : [...currentCategories, cat];

    updateSearchParams(query, newCategories);
  };

  const handleReset = () => {
    setQuery("");
    router.push(`/search`);
  };

  return (
    <div className="w-[35%] flex gap-3 h-10 relative">
      <div className="h-full flex-1">
        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full h-full bg-white/10 backdrop-blur-sm border border-white/30 shadow-lg rounded-4xl px-4 py-1 focus:ring-2 focus:ring-white/30 focus:outline-none"
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
      </div>

      <div
        className="flex w-12 items-center justify-center h-full transition-all bg-white/10 hover:bg-white/30 backdrop-blur-sm border border-white/30 shadow-lg rounded-4xl px-2 py-1 cursor-pointer"
        onClick={handleSearch}
      >
        <GoSearch size={20} />
      </div>

      <button
        onClick={handleReset}
        className="group flex w-10 items-center justify-center h-full transition-all bg-white/10 hover:bg-white/30 backdrop-blur-sm border border-white/30 shadow-lg rounded-4xl px-2 py-1 cursor-pointer"
      >
        <RiResetRightLine
          size={20}
          className="group-hover:rotate-360 transition-all duration-500"
        />
      </button>

      <div
        className={`cursor-pointer transition-all text-center flex items-center justify-center text-white/80 absolute top-11 left-1/2 -translate-x-1/2
    ${
      canHover
        ? isOpenCat
          ? "hover:-translate-y-1"
          : "hover:translate-y-1"
        : ""
    }
  `}
        onClick={(e) => {
          e.currentTarget.blur();
          setIsOpenCat(!isOpenCat);
          setCanHover(false);
        }}
        onMouseEnter={() => {
          if (canHover) setIsHover(true);
        }}
        onMouseLeave={() => {
          setIsHover(false);
          setCanHover(true);
        }}
        onMouseUp={() => {
          setTimeout(() => setCanHover(false), 0);
        }}
      >
        {isOpenCat ? <IoIosArrowUp size={48} /> : <IoIosArrowDown size={48} />}
      </div>

      {isOpenCat && (
        <div
          className={`w-full flex flex-wrap gap-3 items-center justify-center absolute top-25 left-1/2 -translate-x-1/2 transition-all duration-300
            ${
              isHover && canHover
                ? "-translate-y-1 opacity-50"
                : "translate-y-0 opacity-100"
            }
          `}
        >
          {categories.map((cat: ICategory, index: number) => (
            <CategoryMenu
              key={index}
              title={cat.title}
              handleCategoryClick={handleCategoryClick}
              catTitle={cat.title}
              selectedCategories={params.getAll("category")}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Search;
