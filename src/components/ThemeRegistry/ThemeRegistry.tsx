'use client';
import * as React from 'react';
import { StyledEngineProvider, ThemeProvider, createTheme } from '@mui/material/styles';
import NextAppDirEmotionCacheProvider from './EmotionCache';
import { Sarabun } from 'next/font/google';
import { colors } from '../../../tailwind.config';

const sarabun = Sarabun({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  const theme = createTheme({
    palette: {
      mode: "light",
      ...colors
    },
    typography: {
      fontFamily: sarabun.style.fontFamily,
    }
  })

  return (
    <NextAppDirEmotionCacheProvider options={{ key: 'mui' }}>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          {children}
        </ThemeProvider>
      </StyledEngineProvider>
    </NextAppDirEmotionCacheProvider>
  );
}