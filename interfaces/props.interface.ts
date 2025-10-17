import { ReactNode } from "react";
import { IUser } from "./strapi.interface";

export interface Ii18nProps {
  children: ReactNode;
}

export interface IUserProps {
  user: IUser | null;
}

export interface IRichTextEditorProps {
  content: any;
  onChange: (content: any) => void;
}

export interface IHighlightTextProps {
  text?: string;
  highlight?: string;
}

export interface ISubmissionStatusModalProps {
  status: "submitting" | "success" | "error" | null;
  error: string | null;
  onSuccessRedirect: () => void;
  onClose: () => void;
}
