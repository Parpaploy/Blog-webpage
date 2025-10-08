import { ReactNode } from "react";
import { IUser } from "./strapi.interface";

export interface Ii18nProps {
  children: ReactNode;
}

export interface IUserProps {
  user: IUser | null;
}

export interface IRichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
}
