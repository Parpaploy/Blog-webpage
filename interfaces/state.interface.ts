import { SetStateAction } from "../types/logic.type";

export interface ToggleContextType {
  openNavbar: boolean;
  openBlogId: string | null;
  setOpenNavbar: (open: SetStateAction<boolean>) => void;
  setOpenBlogId: (id: string | null) => void;
  closeAll: () => void;
  registerRef: (
    ref: HTMLElement | null,
    type: "navbar" | "blog",
    id?: string
  ) => () => void;
}
