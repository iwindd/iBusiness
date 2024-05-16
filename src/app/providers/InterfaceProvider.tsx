"use client";
import { Backdrop, CircularProgress, Slide } from '@mui/material';
import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import Dialog, { DialogProps as OriginalDialogProps } from '@mui/material/Dialog';
import { SnackbarProvider } from 'notistack';
import { usePathname } from 'next/navigation';
import { TransitionProps } from '@mui/material/transitions';

interface BackdropInterface {
  setBackdrop: React.Dispatch<React.SetStateAction<boolean>>
  isBackdrop: boolean
}

interface InterfaceData extends BackdropInterface{ };

const InterfaceContext = createContext<InterfaceData | undefined>(undefined);

export function useInterface() {
  const context = useContext(InterfaceContext);
  if (context === undefined) {
    throw new Error('useInterface must be used within a InterfaceProvider');
  }
  return context;
}

export function InterfaceProvider({ children }: {
  children: ReactNode;
}) {
  const [isBackdrop, setBackdrop] = React.useState<boolean>(false);

  return (
    <InterfaceContext.Provider
      value={
        {
          setBackdrop: setBackdrop,
          isBackdrop: isBackdrop
        }
      }
    >
      <SnackbarProvider
        maxSnack={5}
        anchorOrigin={{
          horizontal: "right",
          vertical: "bottom"
        }}
      >
        {children}
      </SnackbarProvider>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isBackdrop}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </InterfaceContext.Provider>
  )
}

export default InterfaceContext;