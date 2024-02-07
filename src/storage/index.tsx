"use client";
import React, { ReactNode, useEffect } from "react";

const StorageContext = React.createContext<{
  use: (channel: string, key: string, defaultValue?: any) => any,
  declare: (channel: string, key: string, val: any) => void,
  unused: (channel: string, key: string) => void,
  has: (channel: string, key: string) => boolean
} | undefined>(undefined);

const isJSON = (str: string): boolean => {
  try {
    return (JSON.parse(str) && !!str);
  } catch (e) {
    return false;
  }
}

export const useStorage = (channel?: string) => {
  const context = React.useContext(StorageContext);
  channel = channel || "" as string;

  if (!context) {
    throw new Error('useStorage must be used within a StorageProvider');
  }


  return {
    use: (key: string, defaultValue?: any) => context.use(channel as string, key, defaultValue),
    declare: (key: string, val: any) => context.declare(channel as string, key, val),
    unused: (key: string) => context.unused(channel as string, key),
    has: (key: string) => context.has(channel as string, key)
  }
}

export const StorageProvider = ({ children }: { children: ReactNode }) => {
  const use = (channel: string, key: string, defaultValue?: any) => {
    try {
      let payload = localStorage.getItem(`${channel}-${key}`);

      if (payload != null && isJSON(payload)) {
        payload = JSON.parse(payload)
      }

      return !payload ? defaultValue : payload
    } catch (error) {
      return defaultValue
    }
  }

  const declare = (channel: string, key: string, val: any) => {
    try {
      if (Array.isArray(val)) {
        val = JSON.stringify(val)
      }

      return localStorage.setItem(`${channel}-${key}`, val);
    } catch (error) {
      console.log('cache error');
    }
  }

  const unused = (channel: string, key: string) => {
    return localStorage.removeItem(`${channel}-${key}`);
  }

  const has = (channel: string, key: string) => {
    return !localStorage.getItem(`${channel}-${key}`) ? false : true
  }

  return (
    <StorageContext.Provider
      value={{ use, declare, unused, has }}
    >
      {children}
    </StorageContext.Provider>
  )
}
