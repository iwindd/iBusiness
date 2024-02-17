"use client";
import React from 'react'
import Cart from './components/Cart';
import Cashier from './components/Cashier';
import { AddToCashier } from './action';
import { useSession } from 'next-auth/react';
import { useSnackbar } from 'notistack';

export interface CashierPageChildType {
  addProductToCart: (serial: string) => void
}

const CashierPage = () => {
  const { data: session, update } = useSession();
  const { enqueueSnackbar } = useSnackbar();

  const addProductToCart = async (serial: string) => {
    const resp = await AddToCashier({ serial });
    
    if (!resp.success || session?.user.retail == undefined) {
      if (resp.error == "no_found_product") {
        enqueueSnackbar(`ไม่พบสินค้า ${serial}`, { variant: "error" })
      }

      return false
    };

    await update({
      ...session,
      user: {
        ...session?.user,
        cart: resp.cart
      }
    })

    return true
  }

  return (
    <>
      <Cashier addProductToCart={addProductToCart} />
      <Cart addProductToCart={addProductToCart} />
    </>
  )
}

export default CashierPage