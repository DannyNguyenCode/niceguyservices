'use client';

import { useTheme } from "./theme/ThemeProvider";;

export default function ThemeToggleBtn() {
    const { theme, toggle } = useTheme();

    return (
        <button
            type="button"
            onClick={toggle}
            className="btn btn-ghost btn-sm normal-case"
        >
            {theme === "dark" ? "Light mode" : "Dark mode"}
        </button>
    );
}