"use client";
import { atom } from "recoil";
import { PersistStorage, recoilPersist } from 'recoil-persist'

export interface CartItem {
  id: number,
  serial: string,
  title: string,
  price: number,
  count: number,
  stock: number,
  category: string
}

const localStorage = typeof window !== `undefined` ? window.localStorage : null

const { persistAtom } = recoilPersist({
  key: 'cart-persist',
  storage: localStorage as PersistStorage
})

export const CartState = atom({
  key: 'cart', 
  default: [] as CartItem[],
  effects: [persistAtom]
});