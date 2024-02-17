"use client";
import { Backdrop, CircularProgress } from '@mui/material';
import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import Dialog, { DialogProps as OriginalDialogProps } from '@mui/material/Dialog';
import { SnackbarProvider } from 'notistack';
import { useRouter, usePathname } from 'next/navigation';

interface BackdropInterface {
  setBackdrop: React.Dispatch<React.SetStateAction<boolean>>
}

type theme = "light" | "dark";
interface ThemeInterface {
  theme: theme,
  setTheme: React.Dispatch<React.SetStateAction<theme>>
}

type shopType = "retail" | "wholesale"
interface ShopInterface {
  shop: shopType,
  setShop: React.Dispatch<React.SetStateAction<shopType>>
}

export interface DialogProps<T = any> {
  onOpen: () => void,
  onClose: () => void,
  State: boolean,
  data: T
}
interface DialogInterface {
  setDialog: (Content: React.FC<DialogProps>, data: any, size?: OriginalDialogProps['maxWidth']) => DialogProps
}

interface InterfaceData extends BackdropInterface, DialogInterface, ThemeInterface, ShopInterface { };

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
  const [isDialog, setDialog] = React.useState<boolean>(false);
  const [theme, setTheme] = React.useState<theme>("light");
  const [shop, setShop] = React.useState<shopType>("retail");
  const [DialogContent, setDialogContent] = React.useState<null | JSX.Element>(null);
  const [maxWidth, setMaxWidth] = React.useState<OriginalDialogProps['maxWidth']>('sm');
  const pathname = usePathname();

  const setDialog_ = (
    Content: React.FC<DialogProps>,
    data: any,
    size: OriginalDialogProps['maxWidth'] = "sm"
  ) => {
    const dialogProps = {
      onOpen: () => {
        if (isDialog) return;
        setDialog(true);
        contents()
      },
      onClose: () => setDialog(false),
      State: isDialog,
      data: data
    }

    const contents = () => {
      setDialogContent(<Content {...dialogProps} data={data} />)
      setMaxWidth(size)
    }

    return dialogProps
  }

  useEffect(() => {
    if (isDialog) {setDialog(false)}
  }, [pathname])

  return (
    <InterfaceContext.Provider
      value={
        {
          setBackdrop: setBackdrop,
          setDialog: setDialog_,
          theme: theme,
          setTheme: setTheme,
          shop: shop,
          setShop: setShop
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
      <Dialog
        open={isDialog}
        onClose={() => setDialog(false)}
        aria-labelledby="responsive-dialog-title"
        fullWidth={true}
        maxWidth={maxWidth}
      >
        {DialogContent}
      </Dialog>
    </InterfaceContext.Provider>
  )
}

export default InterfaceContext;
