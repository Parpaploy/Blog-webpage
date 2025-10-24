export type TextSize = "sm" | "base" | "lg" | "xl";

export type Suggestion = {
  text: string;
  type: "title" | "author" | "description";
};

export type SubmissionStatus = "submitting" | "success" | "error" | null;

export type PanelPosition = {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
};
