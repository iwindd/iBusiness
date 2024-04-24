'use client';
import * as React from 'react';
import { StyledEngineProvider, ThemeProvider, createTheme } from '@mui/material/styles';
import NextAppDirEmotionCacheProvider from './EmotionCache';
import { Sarabun } from 'next/font/google';

const sarabun = Sarabun({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  const theme = createTheme({
    palette: {
      mode: "light",
    },
    typography: {
      fontFamily: sarabun.style.fontFamily,
    },
    components: {
      MuiAppBar:{
        styleOverrides: {
          root: {
            boxShadow: "none",
            border:"0px",
          },
        },
      },
      MuiPaper:{
        styleOverrides: {
          root: {
            boxShadow: "none",
          },
        },
      },
      MuiChip:{
        styleOverrides: {
          root: {
            boxShadow: "none",
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: ({ ownerState }) => ({
            ...(ownerState.selected && {})
          }),
        },
      }
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