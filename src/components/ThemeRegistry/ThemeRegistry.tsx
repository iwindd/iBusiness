'use client';
import * as React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import NextAppDirEmotionCacheProvider from './EmotionCache';
import { useInterface } from '@/app/providers/InterfaceProvider';
import { Sarabun } from 'next/font/google';

const sarabun = Sarabun({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  const { theme: theme_ } = useInterface();

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: theme_ == "dark" ? 'dark' : 'light',
        },
        typography: {
          fontFamily: sarabun.style.fontFamily,
        }
      }),
    [theme_],
  );

  return (
    <NextAppDirEmotionCacheProvider options={{ key: 'mui' }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </NextAppDirEmotionCacheProvider>
  );
}