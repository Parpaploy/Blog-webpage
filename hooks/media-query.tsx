"use client";

import { useState, useEffect } from "react";

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window.matchMedia !== "function") {
      return;
    }

    const mediaQueryList = window.matchMedia(query);

    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    setMatches(mediaQueryList.matches);

    try {
      mediaQueryList.addEventListener("change", handleChange);
    } catch (e) {
      mediaQueryList.addListener(handleChange);
    }

    return () => {
      try {
        mediaQueryList.removeEventListener("change", handleChange);
      } catch (e) {
        mediaQueryList.removeListener(handleChange);
      }
    };
  }, [query]);

  return matches;
}
