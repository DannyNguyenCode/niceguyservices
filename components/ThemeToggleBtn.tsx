"use client";

import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { useTheme } from "@/components/theme/ThemeProvider";
import { isDarkTheme } from "@/lib/themes/siteTheme";

export default function ThemeToggleBtn() {
    const { theme, toggle } = useTheme();
    const isDark = isDarkTheme(theme);

    return (
        <button
            type="button"
            onClick={toggle}
            className="btn btn-ghost btn-sm btn-square min-h-11 min-w-11 shrink-0 border-0 bg-transparent shadow-none text-base-content hover:bg-base-200/60 hover:text-base-content focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
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