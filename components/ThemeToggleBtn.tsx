"use client";

import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { useTheme } from "@/components/theme/ThemeProvider";

export default function ThemeToggleBtn() {
    const { theme, toggle } = useTheme();
    const isDark = theme === "dark";

    return (
        <button
            type="button"
            onClick={toggle}
            className="btn btn-ghost btn-sm btn-square shrink-0 border-0 bg-transparent shadow-none text-base-content hover:bg-base-200/60 hover:text-base-content focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-base-content/20"
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
            {isDark ? (
                <SunIcon className="h-5 w-5" aria-hidden />
            ) : (
                <MoonIcon className="h-5 w-5" aria-hidden />
            )}
        </button>
    );
}