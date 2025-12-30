"use client";

import React, {
    createContext,
    useContext,
    useState,
    useEffect,
} from "react";

interface Ctx {
    theme: string;
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
    initialTheme: string; // "light" | "dark" | "retro" etc.
    children: React.ReactNode;
};

const ThemeProvider: React.FC<ThemeProviderProps> = ({
    initialTheme,
    children,
}) => {
    const [theme, setTheme] = useState<string>(initialTheme);

    // apply theme to <html data-theme="..."> + persist in cookie
    useEffect(() => {
        if (typeof document !== "undefined") {
            document.documentElement.dataset.theme = theme;
        }
        document.cookie = `theme=${theme}; path=/; max-age=${60 * 60 * 24 * 365
            }`;
    }, [theme]);

    // simple light/dark toggle (you can extend this later for "retro")
    const toggle = () => {
        const next = theme === "retro" ? "dark" : "retro";
        setTheme(next);
    };

    return (
        <ThemeCtx.Provider value={{ theme, toggle }}>
            {children}
        </ThemeCtx.Provider>
    );
};

export default ThemeProvider;
