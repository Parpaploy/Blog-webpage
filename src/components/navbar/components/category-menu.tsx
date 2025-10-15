import React from "react";

function CategoryMenu({
  title,
  handleCategoryClick,
  catTitle,
  selectedCategories,
  loadingCategories,
  isSearching,
  isResetting,
}: {
  title: string;
  handleCategoryClick: (catTitle: string) => void;
  catTitle: string;
  selectedCategories: string[];
  loadingCategories: string[];
  isSearching: boolean;
  isResetting: boolean;
}) {
  const isSelected = selectedCategories.includes(catTitle);
  const isLoading = loadingCategories.includes(catTitle);

  return (
    <div
      onClick={() => handleCategoryClick(catTitle)}
      className={`cursor-pointer text-center px-4 py-2 rounded-full transition-all backdrop-blur-sm border shadow-lg line-clamp-1 border-white/20
        ${
          isSelected
            ? "bg-white/90 text-black/80"
            : "text-white/80 bg-white/10 hover:bg-white/30 hover:text-white/90"
        }
            
        ${
          !isResetting && !isSearching ? "" : "opacity-60 pointer-events-none"
        }`}
    >
      {isLoading ? (
        <div
          className={`w-5 h-5 border-2 rounded-full animate-spin ${
            isSelected
              ? "border-black/30 border-t-black"
              : "border-white/30 border-t-white"
          }`}
        />
      ) : (
        title
      )}
    </div>
  );
}

export default CategoryMenu;
