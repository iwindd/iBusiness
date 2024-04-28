"use client";
import React, { SetStateAction, createContext, useContext, useEffect } from "react";
import { useSnackbar } from "notistack";
import { useStorage } from "@/storage";
import { FetchingStock } from "@/controllers/StockController";
import { StockItem } from "@/typings/stock";

const stockContext = createContext<{
  items: StockItem[],
  setItem: React.Dispatch<SetStateAction<StockItem[]>>,
  render: (payload: string) => Promise<void>,
} | undefined>(undefined);


export const useStock = () => {
  const context = useContext(stockContext);
  if (context === undefined) {
    throw new Error('useStock must be used within a StockProvider');
  }
  return context;
}

const StockProvider = ({ children }: { children: React.ReactNode }) => {
  const { use, declare } = useStorage("stock");
  const [items, setItem] = React.useState<StockItem[]>(use("stock", []));
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

    const fetchingData = await FetchingStock(resultArray);
    if (fetchingData.state && fetchingData.data) {
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
    }
  }

  return (
    <stockContext.Provider
      value={{ items, setItem, render}}
    >
      {children}
    </stockContext.Provider>
  )
}

export default StockProvider