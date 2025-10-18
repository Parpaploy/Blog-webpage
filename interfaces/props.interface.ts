import { ReactNode } from "react";
import {
  IBlog,
  IBlogSetting,
  ICategory,
  ISubscribeBlog,
  IUser,
} from "./strapi.interface";
import { SubmissionStatus } from "../types/ui.type";

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
  onCreateAnother?: () => void;
  onGoHome: () => void;
}
