'use client';

import { useTheme } from "./theme/ThemeProvider";
import Button from "@mui/material/Button";

export default function ThemeToggleBtn() {
    const { theme, toggle } = useTheme();

    return (
        <Button
            variant="outlined"
            color="inherit"
            size="small"
            onClick={toggle}
        >
            {theme === 'dark' ? 'Light mode' : 'Dark mode'}
        </Button>
    );
}