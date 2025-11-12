"use client";

import React, {
  useEffect,
  useState,
  useTransition,
  useRef,
  useMemo,
} from "react";
import { GoSearch } from "react-icons/go";
import {
  ICategory,
  IBlog,
  ISubscribeBlog,
  IUser,
} from "../../../../interfaces/strapi.interface";
import { useRouter, useSearchParams } from "next/navigation";
import { RiResetRightLine } from "react-icons/ri";
import { Suggestion } from "../../../../types/ui.type";
import { useTranslation } from "react-i18next";
import { BsFilter } from "react-icons/bs";
import { BiCategory } from "react-icons/bi";
import { useToggle } from "../../../../hooks/toggle";
import { useSidebar } from "../../../../hooks/sidebar";
import { Variants } from "framer-motion";
import SearchInput from "./search-input";
import FilterPanel from "./filter-panel";
import CategoryPanel from "./category-panel";

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
  blogs: IBlog[] | [];
  subscribeBlogs: ISubscribeBlog[] | [];
  user: IUser | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  const { t } = useTranslation("navbar");
  const { isSidebar } = useSidebar();
  const { setOpenNavbar, registerBlogToggleCallback } = useToggle();

  const router = useRouter();
  const params = useSearchParams();
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const filterButtonRef = useRef<HTMLButtonElement>(null);
  const categoryButtonRef = useRef<HTMLButtonElement>(null);

  const urlQuery = params.get("query") || "";

  const [isPending, startTransition] = useTransition();
  const [canHover, setCanHover] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    params.getAll("category")
  );

  const isProcessing = isPending || isSearching || loadingCategories.length > 0;
  const isDisable = isPending || isSearching;

  const currentSort = params.get("sortBy") || "latest";
  const defaultDir = currentSort === "alphabetical" ? "asc" : "desc";
  const currentDir = params.get("sortDir") || defaultDir;
  const currentType = params.get("type") || "all";
  const areFiltersActive = currentType !== "all" || currentSort !== "latest";

  const sortOptions = [
    { key: "latest", asc: t("sort.latest"), desc: t("sort.latest") },
    {
      key: "alphabetical",
      asc: t("sort.alphabetical"),
      desc: t("sort.alphabetical"),
    },
    { key: "price", asc: t("sort.price"), desc: t("sort.price") },
  ];

  const menuContainerVariants: Variants = {
    hidden: {
      opacity: 0,
      y: -10,
      transition: { staggerChildren: 0.05, staggerDirection: -1 },
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: { when: "beforeChildren", staggerChildren: 0.05 },
    },
    exit: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.05, staggerDirection: -1 },
    },
  };

  const allEntries = useMemo(
    () => [
      ...blogs.map((b) => ({ ...b, type: "blog" as const })),
      ...subscribeBlogs.map((s) => ({ ...s, type: "subscribe" as const })),
    ],
    [blogs, subscribeBlogs]
  );

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

  const handleResetFilters = () => {
    setIsOpenFilter(false);
    const newParams = new URLSearchParams(params.toString());
    newParams.delete("type");
    newParams.delete("sortBy");
    newParams.delete("sortDir");
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

  const handleCategoryReset = () => {
    if (selectedCategories.length === 0) return;

    setIsOpenCat(false);

    startTransition(() => {
      setSelectedCategories([]);

      const search = new URLSearchParams(params.toString());
      search.delete("category");

      if (query.trim() !== "") search.set("query", query);
      else search.delete("query");

      router.push(`/search?${search.toString()}`);
    });
  };

  useEffect(() => {
    return registerBlogToggleCallback(() => {
      setIsOpenCat(false);
      setIsOpenFilter(false);
    });
  }, [registerBlogToggleCallback, setIsOpenCat, setIsOpenFilter]);

  useEffect(() => {
    if (!isOpenCat && !isOpenFilter) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsOpenCat(false);
        setIsOpenFilter(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpenCat, isOpenFilter, setIsOpenCat, setIsOpenFilter]);

  const updateSearchParams = (
    newQuery: string = urlQuery,
    newCategories: string[] = selectedCategories,
    type: "search" | "category" = "search"
  ) => {
    const search = new URLSearchParams(params.toString());

    if (newQuery.trim() !== "") search.set("query", newQuery);
    else search.delete("query");

    search.delete("category");
    newCategories.forEach((c) => search.append("category", c));

    if (type === "search") setIsSearching(true);
    router.push(`/search?${search.toString()}`);
  };

  const isQueryUnchanged = (currentQuery: string) => {
    const paramQuery = params.get("query") || "";
    const paramCategories = params.getAll("category").sort();
    const newCategories = [...selectedCategories].sort();
    return (
      currentQuery.trim() === paramQuery.trim() &&
      JSON.stringify(paramCategories) === JSON.stringify(newCategories)
    );
  };

  const [query, setQuery] = useState(urlQuery);

  const handleSearch = () => {
    const currentQuery = params.get("query") || "";
    const currentCategories = params.getAll("category").sort();
    const newCategories = [...selectedCategories].sort();
    if (
      query.trim() === currentQuery.trim() &&
      JSON.stringify(currentCategories) === JSON.stringify(newCategories)
    ) {
      return;
    }

    setOpenNavbar(false);
    setIsOpenCat(false);
    setIsOpenFilter(false);
    updateSearchParams(query, selectedCategories, "search");
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
    setQuery("");
    setSelectedCategories([]);
    setLoadingCategories([]);
    startTransition(() => {
      router.push(`/search`);
    });
  };

  useEffect(() => {
    setIsSearching(false);
    setLoadingCategories([]);
  }, [params.toString()]);

  const onInputFocus = () => {
    setIsOpenCat(false);
    setIsOpenFilter(false);
    setOpenNavbar(false);
  };

  const onSuggestionClicked = (suggestion: Suggestion) => {
    setQuery(suggestion.text);
    updateSearchParams(suggestion.text, selectedCategories, "search");
  };

  return (
    <div
      className={`flex lg:gap-2 gap-1 transition-all ${
        isSidebar && "lg:gap-2 md:gap-0.5"
      } h-10 relative`}
      ref={searchContainerRef}
    >
      <button
        ref={categoryButtonRef}
        disabled={isProcessing}
        className={`flex w-10 items-center justify-center h-full transition-all backdrop-blur-sm border border-white/30 shadow-md rounded-4xl px-2 py-1 ${
          isOpenCat
            ? "bg-white/30 text-white/90"
            : "bg-white/10 hover:bg-white/30 text-white/60 hover:text-white/80"
        } disabled:bg-white/10 disabled:text-white/60 disabled:opacity-60 disabled:cursor-not-allowed ${
          !isProcessing ? "cursor-pointer" : ""
        }`}
        onClick={(e) => {
          e.currentTarget.blur();
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

      <SearchInput
        urlQuery={urlQuery}
        query={query}
        setQuery={setQuery}
        isPending={isPending}
        isProcessing={isProcessing}
        t={t}
        allBlogs={allEntries}
        selectedCategories={selectedCategories}
        currentType={currentType}
        onSearch={handleSearch}
        onFocus={onInputFocus}
        onSuggestionClick={onSuggestionClicked}
      />

      <button
        disabled={isProcessing || isQueryUnchanged(query)}
        className={`flex w-10 items-center justify-center h-full transition-all bg-white/10 hover:bg-white/30 backdrop-blur-sm border border-white/30 shadow-md rounded-4xl px-2 py-1 
                    disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-white/10 ${
                      isProcessing || isQueryUnchanged(query)
                        ? ""
                        : "cursor-pointer"
                    }`}
        onClick={handleSearch}
      >
        {isSearching ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <GoSearch size={20} />
        )}
      </button>

      <div className="relative">
        <button
          ref={filterButtonRef}
          disabled={isProcessing}
          className={`flex w-10 items-center justify-center h-full transition-all backdrop-blur-sm border border-white/30 shadow-md rounded-4xl px-2 py-1 ${
            isOpenFilter
              ? "bg-white/30 text-white/90"
              : "bg-white/10 hover:bg-white/30 text-white/80 hover:text-white/90"
          } disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/80 ${
            !isProcessing ? "cursor-pointer" : ""
          }`}
          onClick={(e) => {
            e.currentTarget.blur();
            setIsOpenCat(false);
            setOpenNavbar(false);
            setIsOpenFilter(!isOpenFilter);
            setCanHover(false);
          }}
        >
          <BsFilter size={24} />
        </button>

        <FilterPanel
          isOpenFilter={isOpenFilter}
          buttonRef={filterButtonRef}
          isDisable={isDisable}
          currentType={currentType}
          sortOptions={sortOptions}
          currentSort={currentSort}
          currentDir={currentDir}
          areFiltersActive={areFiltersActive}
          t={t}
          onTypeChange={handleTypeChange}
          onSortChange={handleSortChange}
          onFilterReset={handleResetFilters}
        />
      </div>

      <button
        disabled={
          isProcessing ||
          !(
            query.trim() !== "" ||
            selectedCategories.length > 0 ||
            params.get("sortBy") ||
            params.get("type")
          )
        }
        onClick={handleReset}
        className={`group flex w-10 items-center justify-center h-full transition-all bg-white/10 hover:bg-white/30 backdrop-blur-sm border border-white/30 shadow-md rounded-4xl px-2 py-1 
                    disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-white/10 ${
                      !isProcessing &&
                      (query.trim() !== "" ||
                        selectedCategories.length > 0 ||
                        params.get("sortBy") ||
                        params.get("type"))
                        ? "cursor-pointer"
                        : ""
                    }`}
      >
        <RiResetRightLine
          size={20}
          className={`${
            isPending
              ? "animate-spin-smooth"
              : "group-hover:rotate-360 transition-transform duration-500 group-disabled:rotate-0"
          }`}
        />
      </button>

      <CategoryPanel
        isOpenCat={isOpenCat}
        menuContainerVariants={menuContainerVariants}
        categories={categories}
        onCategoryClick={handleCategoryClick}
        selectedCategories={selectedCategories}
        loadingCategories={loadingCategories}
        isDisable={isDisable}
        onCategoryReset={handleCategoryReset}
        buttonRef={categoryButtonRef}
      />
    </div>
  );
}

export default Search;
