"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "../context/ThemeProvider";

const navigationItems = [
  { label: "Home", href: "/" },
  { label: "Sentences", href: "/sentences" },
  { label: "Login", href: "/login" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { theme, toggle } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isItemActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(href);
  };

  return (
    <header className="navbar sticky top-0 z-50 border-b border-base-200 bg-base-100/95 px-4 shadow-sm backdrop-blur supports-backdrop-filter:bg-base-100/80 md:px-8">
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3 px-2 text-lg md:text-2xl font-semibold normal-case">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-content text-2xl font-bold">
              G
            </span>
            <span className="leading-none">Grammify</span>
          </Link>
        </div>

        <nav className="flex items-center gap-3">
          {navigationItems.map((item) => {
            const isActive = isItemActive(item.href);

            return (
              <Link
                key={item.label}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`btn btn-ghost btn-md text-lg md:text-xl transition-all duration-200 ${
                  isActive
                    ? "bg-primary! text-primary-content! border-primary! shadow-sm"
                    : "text-base-content hover:bg-primary! hover:text-primary-content! hover:border-primary! hover:shadow-md hover:-translate-y-0.5 focus-visible:bg-primary! focus-visible:text-primary-content! focus-visible:border-primary!"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <button
            type="button"
            onClick={toggle}
            className="btn btn-ghost btn-md p-2 text-lg md:text-xl transition-all duration-200 hover:bg-primary! hover:text-primary-content! hover:border-primary! hover:shadow-md hover:-translate-y-0.5 focus-visible:bg-primary! focus-visible:text-primary-content! focus-visible:border-primary!"
            aria-label={
              !isMounted ? "Toggle color mode" : theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            {isMounted && theme === "dark" ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364-6.364l-1.414 1.414M7.05 16.95l-1.414 1.414M16.95 16.95l1.414 1.414M7.05 7.05L5.636 5.636M12 8a4 4 0 100 8 4 4 0 000-8z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
              </svg>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
}