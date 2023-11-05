"use client";
import React from 'react'
import Cart from './components/Cart';
import Cashier from './components/Cashier';
import { AddToCashier } from './action';
import { useSession } from 'next-auth/react';
import { useInterface } from '../components/InterfaceProvider';

export interface CashierPageChildType {
  addProductToCart:  (serial: string) => void
}

const CashierPage = () => {
  const { data: session, update } = useSession();
  const { useToast } = useInterface();

  const addProductToCart = async (serial: string) => {
    const resp = await AddToCashier({ serial });

    if (!resp.success) {
      if (resp.error == "no_found_product") {
        useToast(`ไม่พบสินค้า ${serial}`, "alert alert-error")
      }

      return
    };
    const cart = session?.user.cart == null ? [] : session.user.cart;

    const product = cart.find(p => p.serial == serial);
    if (!product) {
      cart.push({
        serial: resp.data?.serial as string,
        title: resp.data?.title as string,
        price: resp.data?.price as number,
        count: 1,
        category: resp.data?.category.title as string
      })
    } else {
      product.count++
    }

    await update({
      ...session,
      user: {
        ...session?.user,
        cart
      }
    })
  }

  return (
    <div>
      <Cashier addProductToCart={addProductToCart} />
      <Cart addProductToCart={addProductToCart} />
    </div>
  )
}

export default CashierPage