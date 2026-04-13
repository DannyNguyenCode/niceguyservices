"use client";

import {
    createContext,
    useContext,
    useState,
    useEffect,
    type ReactNode,
} from "react";
import type { SiteColorMode } from "@/lib/themes/siteTheme";

interface Ctx {
    theme: SiteColorMode;
    toggle: () => void;
}

const ThemeCtx = createContext<Ctx | null>(null);

export const useTheme = () => {
    const ctx = useContext(ThemeCtx);
    if (!ctx) {
        throw new Error("useTheme must be used within ThemeProvider");
    }
    return ctx;
};

type ThemeProviderProps = {
    initialTheme: SiteColorMode;
    children: ReactNode;
};

export default function ThemeProvider({
    initialTheme,
    children,
}: ThemeProviderProps) {
    const [theme, setTheme] = useState<SiteColorMode>(initialTheme);

    useEffect(() => {
        document.documentElement.setAttribute(
            "data-theme",
            theme === "dark" ? "niceguys-dark" : "niceguys-light",
        );
        document.cookie = `theme=${theme}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
    }, [theme]);

    const toggle = () => {
        setTheme((t) => (t === "light" ? "dark" : "light"));
    };

    return (
        <ThemeCtx.Provider value={{ theme, toggle }}>
            {children}
        </ThemeCtx.Provider>
    );
}
