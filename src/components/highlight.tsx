import React from "react";
import { IHighlightTextProps } from "../../interfaces/props.interface";

const HighlightText: React.FC<IHighlightTextProps> = ({
  text = "",
  highlight = "",
}) => {
  if (!highlight || highlight.trim() === "" || !text) {
    return <span>{text}</span>;
  }

  const lowerCaseHighlight = highlight.toLowerCase();
  const lowerCaseText = text.toLowerCase();
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let matchIndex;

  while (
    (matchIndex = lowerCaseText.indexOf(lowerCaseHighlight, lastIndex)) > -1
  ) {
    const beforeText = text.substring(lastIndex, matchIndex);
    if (beforeText) {
      parts.push(beforeText);
    }

    const matchedText = text.substring(
      matchIndex,
      matchIndex + highlight.length
    );
    parts.push(
      <span key={lastIndex} className="bg-white/70 text-white/90">
        {matchedText}
      </span>
    );

    lastIndex = matchIndex + highlight.length;
  }

  const afterText = text.substring(lastIndex);
  if (afterText) {
    parts.push(afterText);
  }

  return <span>{parts}</span>;
};

export default HighlightText;
