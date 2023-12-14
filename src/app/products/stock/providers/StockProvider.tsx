"use client";
import React, { SetStateAction, createContext, useContext, useEffect } from "react";
import { commitStock, fetchingStock } from "../action";
import { useSnackbar } from "notistack";
import { useStorage } from "@/storage";

const stockContext = createContext<{
  items: item[],
  setItem: React.Dispatch<SetStateAction<item[]>>,
  render: (payload: string) => Promise<void>,
  commit: (items?: item[]) => Promise<void>
} | undefined>(undefined);

export interface item {
  id: number,
  serial: string,
  title: string,
  stock: number,
  payload: number,
  all: number
}

export const useStock = () => {
  const context = useContext(stockContext);
  if (context === undefined) {
    throw new Error('useInterface must be used within a InterfaceProvider');
  }
  return context;
}

const StockProvider = ({ children }: { children: React.ReactNode }) => {
  const { use, declare } = useStorage("stock");
  const [items, setItem] = React.useState<item[]>(use("stock", []));
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    declare("stock", items)
  }, [declare, items])

  const render = async (payload: string) => {
    const lines = payload.split(/\r?\n/);
    const resultArray: Record<string, number> = {};

    lines.forEach(line => {
      const [id, valueStr] = line.split(' ');
      const value = parseInt(valueStr);

      if (isNaN(value)) {
        throw new Error('Invalid value in the file.');
      }

      if (resultArray[id] !== undefined) {
        resultArray[id] += value;
      } else {
        resultArray[id] = value;
      }
    });

    const fetchingData = await fetchingStock(resultArray);
    if (fetchingData.success && fetchingData.data) {
      if (fetchingData?.data?.length > 0) {
        setItem(fetchingData.data.map((product) => {
          return {
            ...product,
            payload: resultArray[product.serial],
            all: product.stock + resultArray[product.serial]
          }
        }))
        enqueueSnackbar("เพิ่มข้อมูลสำเร็จ :)", { variant: "success" });
      } else {
        enqueueSnackbar("ไม่พบสินค้า!", { variant: "error" });
      }
    } else {
      throw new Error(fetchingData.error as string);
    }
  }

  const commit = async (payload?: item[]) => {
    await commitStock(payload || items);
    setItem([]);
  }

  return (
    <stockContext.Provider
      value={{ items, setItem, render, commit }}
    >
      {children}
    </stockContext.Provider>
  )
}

export default StockProvider