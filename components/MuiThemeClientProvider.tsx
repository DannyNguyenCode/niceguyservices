'use client';

import React, { useMemo } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

type Mode = 'light' | 'dark';

export default function MuiThemeClientProvider({
  initialMode,
  children,
}: {
  initialMode: Mode;
  children: React.ReactNode;
}) {
  const theme = useMemo(
    () =>
      createTheme({
        palette: { mode: initialMode },
      }),
    [initialMode],
  );

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}


