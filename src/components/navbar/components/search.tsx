"use client";

import React, { useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { GoSearch } from "react-icons/go";
import { ICategory } from "../../../../interfaces/strapi.interface";
import { useRouter, useSearchParams } from "next/navigation";
import CategoryMenu from "./category-menu";

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

  const [query, setQuery] = useState("");

  const handleSearch = () => {
    if (query.trim() !== "") {
      router.push(`/search?query=${encodeURIComponent(query)}`);
    } else {
      router.push(`/search`);
    }
  };

  const handleCategoryClick = (cat: string) => {
    const currentCategories = params.getAll("category");
    const newCategories = currentCategories.includes(cat)
      ? currentCategories.filter((c) => c !== cat)
      : [...currentCategories, cat];

    const query = params.get("query");
    const search = new URLSearchParams();

    if (query) search.set("query", query);

    newCategories.forEach((c) => search.append("category", c));

    router.push(`/search?${search.toString()}`);
    // setIsOpenCat(false);
  };

  return (
    <div className="w-[35%] flex gap-3 h-10 relative">
      <div className="h-full flex-1">
        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full h-full bg-white/10 backdrop-blur-sm border border-white/30 shadow-lg rounded-4xl px-4 py-1"
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
      </div>
      <div
        className="flex w-12 items-center justify-center h-full transition-all bg-white/10 hover:bg-white/30 backdrop-blur-sm border border-white/30 shadow-lg rounded-4xl px-2 py-1 cursor-pointer"
        onClick={handleSearch}
      >
        <GoSearch size={20} />
      </div>

      <div
        className={`cursor-pointer ${
          isOpenCat ? "hover:-translate-y-1" : "hover:translate-y-1"
        } transition-all hover:text-white/90 text-center flex items-center justify-center text-white/80 absolute top-11 left-1/2 -translate-x-1/2`}
        onClick={() => {
          setIsOpenCat(!isOpenCat);
        }}
        onMouseEnter={() => {
          setIsHover(true);
        }}
        onMouseLeave={() => {
          setIsHover(false);
        }}
      >
        {isOpenCat ? <IoIosArrowUp size={48} /> : <IoIosArrowDown size={48} />}
      </div>

      {isOpenCat && (
        <div
          className={`w-full flex flex-wrap gap-3 items-center justify-center absolute top-25 left-1/2 -translate-x-1/2 transition-all ${
            isHover && isOpenCat && "-translate-y-1 opacity-50"
          }`}
        >
          {categories.map((cat: ICategory, index: number) => {
            return (
              <CategoryMenu
                key={index}
                title={cat.title}
                handleCategoryClick={handleCategoryClick}
                catTitle={cat.title}
                selectedCategories={params.getAll("category")}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Search;
