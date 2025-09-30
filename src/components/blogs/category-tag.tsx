import React from "react";
import { TextSize } from "../../../types/ui.type";
import { getTextSizeClass } from "../../../utils/text-sixe";

export default function CategoryTag({
  title,
  textSize,
}: {
  title: string;
  textSize: TextSize;
}) {
  return (
    <div
      className={`text-white px-1 rounded-md bg-gray-400 ${getTextSizeClass(
        textSize
      )}`}
    >
      {title}
    </div>
  );
}
