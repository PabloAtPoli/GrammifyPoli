"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

type ThemeContextValue = {
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggle: () => void;
  isReady: boolean;
};

const defaultContext: ThemeContextValue = {
  theme: "light",
  setTheme: () => {},
  toggle: () => {},
  isReady: false,
};

const ThemeContext = createContext<ThemeContextValue>(defaultContext);

function getDocumentTheme(): Theme | null {
  if (typeof document === "undefined") {
    return null;
  }

  const attrTheme = document.documentElement.getAttribute("data-theme");
  return attrTheme === "light" || attrTheme === "dark" ? attrTheme : null;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const initialTheme = getDocumentTheme();
  const [theme, setTheme] = useState<Theme>(initialTheme ?? "light");
  const [isReady, setIsReady] = useState(initialTheme !== null);

  useEffect(() => {
    if (isReady) {
      return;
    }

    try {
      const saved = localStorage.getItem("theme") as Theme | null;
      if (saved === "light" || saved === "dark") {
        setTheme(saved);
      } else {
        setTheme(window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
      }
    } catch (e) {
      // ignore localStorage access issues
    } finally {
      setIsReady(true);
    }
  }, [isReady]);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    try {
      document.documentElement.setAttribute("data-theme", theme);
      localStorage.setItem("theme", theme);
    } catch (e) {
      // ignore browser storage/DOM access errors
    }
  }, [theme, isReady]);

  const toggle = () => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggle, isReady }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
