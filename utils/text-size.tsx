import { TextSize } from "../types/ui.type";

export function getTextSizeClass(textSize: TextSize) {
  return {
    sm: "text-sm",
    base: "text-base",
    lg: "text-lg",
    xl: "text-xl",
  }[textSize];
}
