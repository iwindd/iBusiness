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
      ...colors,
      background: {
        default: colors.base.main
      },
      divider: colors.base.divider
    },
    typography: {
      fontFamily: sarabun.style.fontFamily,
    },
    components: {
      MuiAppBar:{
        styleOverrides: {
          root: {
            background: colors.common.main,
            boxShadow: "none",
            border:"0px",
            borderBottom: `1px solid ${colors.base.divider}`,
          },
        },
      },
      MuiPaper:{
        styleOverrides: {
          root: {
            background: colors.common.main,
            boxShadow: "none",
            border: `1px solid ${colors.base.divider}`
          },
        },
      },
      MuiChip:{
        styleOverrides: {
          root: {
            background: colors.common.main,
            boxShadow: "none",
            border: `1px solid ${colors.base.divider}`
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: ({ ownerState }) => ({
            ...(ownerState.selected && {
              color: colors.primary.main,
            })
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