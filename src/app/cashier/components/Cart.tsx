"use client";
import { useSession } from 'next-auth/react';
import React from 'react'
import { filterArrayByProperty } from '@/libs/utils';
import { Item } from './childs/CartItem';
import { CashierPageChildType } from '../page';

const Cart = (props : CashierPageChildType) => {
  const { data: session } = useSession();
  const Cart = session?.user.cart ? session.user.cart : [];

  return (
    <ul>
      {
        filterArrayByProperty(Cart, "serial").map((product, index) => {
          return <Item
            key={`${product.serial}-${index}`}
            items={Cart}
            {...props}
            {...product}
          />
        })
      }
    </ul>
  )
}

export default Cart