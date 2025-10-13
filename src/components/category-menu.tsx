import React from "react";

function CategoryMenu({ title }: { title: string }) {
  return (
    <div className="text-white/80 cursor-pointer text-center px-4 py-2 rounded-full bg-white/10 hover:bg-white/30 transition-all hover:text-white/90 backdrop-blur-sm border border-white/20 shadow-lg line-clamp-1">
      {title}
    </div>
  );
}

export default CategoryMenu;
