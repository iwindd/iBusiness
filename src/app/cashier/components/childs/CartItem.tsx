"use client";
import React from 'react'
import { CartItem } from '../../../../../next-auth';
import { useSession } from 'next-auth/react';
import { CashierPageChildType } from '../../page';

interface ItemProps extends CartItem, CashierPageChildType {
  items: CartItem[]
}

export const Item = (props: ItemProps) => {
  const { data: session, update } = useSession();
  const count: number = props.items.filter((item) => item.serial == props.serial).length;

  const onDelete = () => {
    const cart = session?.user.cart ? session.user.cart : []
    update({
      ...session,
      user: {
        ...session?.user,
        cart: cart.filter((product) => product.serial != props.serial)
      }
    })
  }

  const onIncrease = () => props.addProductToCart(props.serial)

  return (
    <li>
      {props.title}
      x
      {count}

      <button className="btn btn-error" onClick={onDelete}>ลบ</button>
      <button className="btn btn-primary" onClick={onIncrease}>เพิ่ม</button>
    </li>
  )
}