import React from "react";

function CategoryMenu({
  title,
  handleCategoryClick,
  catTitle,
  selectedCategories,
}: {
  title: string;
  handleCategoryClick: (catTitle: string) => void;
  catTitle: string;
  selectedCategories: string[];
}) {
  const isSelected = selectedCategories.includes(catTitle);

  return (
    <div
      onClick={() => handleCategoryClick(catTitle)}
      className={`cursor-pointer text-center px-4 py-2 rounded-full transition-all backdrop-blur-sm border shadow-lg line-clamp-1 border-white/20
        ${
          isSelected
            ? "bg-white/90 text-black/80"
            : "text-white/80 bg-white/10 hover:bg-white/30 hover:text-white/90"
        }`}
    >
      {title}
    </div>
  );
}

export default CategoryMenu;
