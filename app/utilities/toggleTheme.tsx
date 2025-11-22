import React, { useState } from 'react';
import { getCookies } from '@/app/utilities/getCookie';
export const toggleTheme = async (initialTheme: string) => {

    const [theme, setTheme] = useState<string>(initialTheme);
    const next: string = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    getCookies(next);
    return null
}