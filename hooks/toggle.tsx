"use client";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { ToggleContextType } from "../interfaces/state.interface";
import { SetStateAction } from "../types/logic.type";

const ToggleContext = createContext<ToggleContextType | undefined>(undefined);

export function ToggleProvider({ children }: { children: ReactNode }) {
  const [openNavbar, setOpenNavbar] = useState(false);
  const [openBlogId, setOpenBlogId] = useState<string | null>(null);
  const refs = useRef<Map<string, HTMLElement>>(new Map());
  const onBlogToggleCallbacks = useRef<Set<() => void>>(new Set());

  const closeAll = useCallback(() => {
    setOpenNavbar(false);
    setOpenBlogId(null);
  }, []);

  const handleSetOpenNavbar = useCallback(
    (openOrUpdater: SetStateAction<boolean>) => {
      if (typeof openOrUpdater === "function") {
        setOpenNavbar((prev) => {
          const newValue = openOrUpdater(prev);
          if (newValue) {
            setOpenBlogId(null);
          }
          return newValue;
        });
      } else {
        if (openOrUpdater) {
          setOpenBlogId(null);
        }
        setOpenNavbar(openOrUpdater);
      }
    },
    []
  );

  const handleSetOpenBlogId = useCallback((id: string | null) => {
    if (id !== null) {
      setOpenNavbar(false);

      onBlogToggleCallbacks.current.forEach((callback) => callback());
    }
    setOpenBlogId(id);
  }, []);

  const registerBlogToggleCallback = useCallback((callback: () => void) => {
    onBlogToggleCallbacks.current.add(callback);
    return () => {
      onBlogToggleCallbacks.current.delete(callback);
    };
  }, []);

  const registerRef = useCallback(
    (ref: HTMLElement | null, type: "navbar" | "blog", id?: string) => {
      if (!ref) return () => {};
      const key = type === "navbar" ? "navbar" : `blog-${id}`;
      refs.current.set(key, ref);
      return () => {
        refs.current.delete(key);
      };
    },
    []
  );

  useEffect(() => {
    let isListenerActive = false;
    const handleClickOutside = (event: MouseEvent) => {
      if (!isListenerActive) return;
      const target = event.target as Node;

      if (openNavbar) {
        const navRef = refs.current.get("navbar");
        if (navRef && !navRef.contains(target)) {
          closeAll();
        }
        return;
      }

      if (openBlogId) {
        const blogRef = refs.current.get(`blog-${openBlogId}`);
        if (blogRef && !blogRef.contains(target)) {
          closeAll();
        }
        return;
      }
    };

    if (openNavbar || openBlogId !== null) {
      const timerId = setTimeout(() => {
        isListenerActive = true;
        document.addEventListener("mousedown", handleClickOutside);
      }, 10);

      return () => {
        clearTimeout(timerId);
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [openNavbar, openBlogId, closeAll]);

  return (
    <ToggleContext.Provider
      value={{
        openNavbar,
        openBlogId,
        setOpenNavbar: handleSetOpenNavbar,
        setOpenBlogId: handleSetOpenBlogId,
        closeAll,
        registerRef,
        registerBlogToggleCallback,
      }}
    >
      {children}
    </ToggleContext.Provider>
  );
}

export function useToggle() {
  const context = useContext(ToggleContext);
  if (context === undefined) {
    throw new Error("useToggle must be used within a ToggleProvider");
  }
  return context;
}
