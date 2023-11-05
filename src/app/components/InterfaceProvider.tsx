"use client";
import React, { createContext, useContext, ReactNode } from 'react';

interface ToastInterface {
  useToast: (message: string, className: string) => void
}

interface InterfaceData extends ToastInterface { }

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
}
) {
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

  return <InterfaceContext.Provider
    value={
      {
        useToast: useToast
      }
    }
  >
    <div className="toast toast-end">
      {
        toasts.map((t) => {
          return (
            <div className={t.className}>
              <span>{t.msg}</span>
            </div>
          )
        })
      }
    </div>
    {children}
  </InterfaceContext.Provider>;
}

export default InterfaceContext;