'use client'

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

interface Ctx { theme: string; toggle: () => void; }

const ThemeCtx = createContext<Ctx | null>(null);
export const useTheme = () => useContext(ThemeCtx)!;

// component
const ThemeProvider = ({
    initialTheme,
    children,
}: {
    initialTheme: string;
    children: React.ReactNode;
}) => {
    // state
    const [theme, setTheme] = useState<string>(initialTheme);

    // set document theme + persist to cookie on the client
    useEffect(() => {
        document.documentElement.dataset.theme = theme;
        document.cookie = `theme=${theme}; path=/; max-age=${60 * 60 * 24 * 365}`;
    }, [theme]);

    const muiTheme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode: theme === 'dark' ? 'dark' : 'light',
                    primary: {
                        main: '#00345e',    // blue
                        light: '#90caf9', // light blue
                        dark: '#0d47a1', // dark blue
                        contrastText: '#ffffff',
                    },
                    background: {
                        default: theme === 'dark' ? '#050816' : '#f3f4f6', // near-black / light grey
                        paper: theme === 'dark' ? '#0b1120' : '#ffffff',
                    },
                    text: {
                        primary: theme === 'dark' ? '#f9fafb' : '#00345e',   // almost white / blue
                        secondary: theme === 'dark' ? '#ffffff' : '#000000', // greys
                    },
                    divider: theme === 'dark' ? '#1f2937' : '#e5e7eb',
                },
                typography: {
                    // Use Geist as primary font, fallback to system sans
                    fontFamily: 'var(--font-geist-sans), system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                    h3: {
                        fontWeight: 800,
                        letterSpacing: '.18em',
                        textTransform: 'uppercase',
                    },
                    h4: {
                        fontWeight: 700,
                    },
                    h5: {
                        fontWeight: 600,
                    },
                    body1: {
                        fontSize: 16,
                        lineHeight: 1.6,
                    },
                    body2: {
                        fontSize: 14,
                        lineHeight: 1.6,
                    },
                },
                components: {
                    MuiButton: {
                        styleOverrides: {
                            root: {
                                borderRadius: 8,
                                textTransform: 'none',
                            },
                            outlinedPrimary: ({ theme }) => ({
                                borderWidth: 1.25,
                                borderColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.12)' : undefined,
                                color: theme.palette.mode === 'dark' ? theme.palette.primary.contrastText : undefined,
                                '&:hover': {
                                    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.06)' : undefined,
                                },
                            }),
                            containedPrimary: ({ theme }) => ({
                                color: theme.palette.primary.contrastText,
                            }),
                        },
                    },
                },
            }),

        [theme],
    );

    const toggle = () => {
        const next: string = theme === 'light' ? 'dark' : 'light';
        setTheme(next);
    };

    return (
        <ThemeCtx.Provider value={{ theme, toggle }}>
            <MuiThemeProvider theme={muiTheme}>
                <CssBaseline />
                {children}
            </MuiThemeProvider>
        </ThemeCtx.Provider>
    );
};

export default ThemeProvider;