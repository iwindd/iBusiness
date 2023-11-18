"use client";
import { Backdrop, CircularProgress } from '@mui/material';
import React, { createContext, useContext, ReactNode } from 'react';
import Dialog, { DialogProps as OriginalDialogProps } from '@mui/material/Dialog';

interface ToastInterface {
  useToast: (message: string, className: string) => void
}

interface BackdropInterface {
  useBackdrop: React.Dispatch<React.SetStateAction<boolean>>
}

export interface DialogProps<T = any> {
  onOpen: () => void,
  onClose: () => void,
  State: boolean,
  data: T
}
interface DialogInterface {
  useDialog: (Content: React.FC<DialogProps>, data: any, size?: OriginalDialogProps['maxWidth']) => DialogProps
}

interface InterfaceData extends ToastInterface, BackdropInterface, DialogInterface { };

const InterfaceContext = createContext<InterfaceData | undefined>(undefined);

export function useInterface() {
  const context = useContext(InterfaceContext);
  if (context === undefined) {
    throw new Error('useInterface must be used within a InterfaceProvider');
  }
  return context;
}

let ToastIndex = 0;
export function InterfaceProvider({ children }: {
  children: ReactNode;
}) {
  const [isBackdrop, setBackdrop] = React.useState<boolean>(false);
  const [isDialog, setDialog] = React.useState<boolean>(false);
  const [DialogContent, setDialogContent] = React.useState<null | JSX.Element>(null);
  const [maxWidth, setMaxWidth] = React.useState<OriginalDialogProps['maxWidth']>('sm');

  const [toasts, setToasts] = React.useState<{
    msg: string,
    className: string,
    index: number
  }[]>([])


  const useToast = (msg: string, className: string) => {
    ToastIndex++;
    const saveIndex = ToastIndex
    setToasts(toasts => [...toasts, { msg, className, index: saveIndex }])
    setTimeout(() => setToasts(toasts => toasts.filter(t => t.index != saveIndex)), 5000)
  }

  const useDialog = (
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

  return <InterfaceContext.Provider
    value={
      {
        useToast: useToast,
        useBackdrop: setBackdrop,
        useDialog: useDialog
      }
    }
  >
    <div className="toast toast-end">
{/*       {
        toasts.map((t) => {
          return (
            <div className={t.className}>
              <span>{t.msg}</span>
            </div>
          )
        })
      } */}
    </div>
    {children}
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
  </InterfaceContext.Provider>;
}

export default InterfaceContext;
