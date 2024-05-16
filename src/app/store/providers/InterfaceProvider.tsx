"use client";
import { Backdrop, CircularProgress, Slide } from '@mui/material';
import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import Dialog, { DialogProps as OriginalDialogProps } from '@mui/material/Dialog';
import { SnackbarProvider } from 'notistack';
import { useRouter, usePathname } from 'next/navigation';
import { TransitionProps } from '@mui/material/transitions';

interface BackdropInterface {
  setBackdrop: React.Dispatch<React.SetStateAction<boolean>>
  isBackdrop: boolean
}

type theme = "light" | "dark";
interface ThemeInterface {
  theme: theme,
  setTheme: React.Dispatch<React.SetStateAction<theme>>
}

export interface DialogProps<T = any> {
  onOpen: (payload?: any) => void,
  onClose: () => void,
  State: boolean,
  data: T,
  payload?: any
}
interface DialogInterface {
  setDialog: (Content: React.FC<DialogProps>, data: any, size?: OriginalDialogProps['maxWidth']) => DialogProps
}

interface InterfaceData extends BackdropInterface, DialogInterface, ThemeInterface { };

const InterfaceContext = createContext<InterfaceData | undefined>(undefined);

export function useInterface() {
  const context = useContext(InterfaceContext);
  if (context === undefined) {
    throw new Error('useInterface must be used within a InterfaceProvider');
  }
  return context;
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="down" ref={ref} {...props} />;
});

export function InterfaceProvider({ children }: {
  children: ReactNode;
}) {
  const [isBackdrop, setBackdrop] = React.useState<boolean>(false);
  const [isDialog, setDialog] = React.useState<boolean>(false);
  const [theme, setTheme] = React.useState<theme>("light");
  const [DialogContent, setDialogContent] = React.useState<null | JSX.Element>(null);
  const [maxWidth, setMaxWidth] = React.useState<OriginalDialogProps['maxWidth']>('sm');
  const pathname = usePathname();

  const setDialog_ = (
    Content: React.FC<DialogProps>,
    data: any,
    size: OriginalDialogProps['maxWidth'] = "sm"
  ) => {
    const dialogProps = {
      onOpen: (payload?: any) => {
        if (isDialog) return;
        setDialog(true);
        contents(payload)
      },
      onClose: () => setDialog(false),
      State: isDialog,
      data: data
    }

    const contents = (payload?: any) => {
      setDialogContent(<Content {...dialogProps} data={data} payload={payload} />)
      setMaxWidth(size)
    }

    return dialogProps
  }

  useEffect(() => {
    if (isDialog) { setDialog(false) }
  }, [pathname])

  return (
    <InterfaceContext.Provider
      value={
        {
          setBackdrop: setBackdrop,
          isBackdrop: isBackdrop,
          setDialog: setDialog_,
          theme: theme,
          setTheme: setTheme
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
        TransitionComponent={Transition}
        onClose={() => setDialog(false)}
        aria-labelledby="responsive-dialog-title"
        fullWidth={true}
        maxWidth={maxWidth}
        disableRestoreFocus
      >

        {DialogContent}
      </Dialog>
    </InterfaceContext.Provider>
  )
}

export default InterfaceContext;
