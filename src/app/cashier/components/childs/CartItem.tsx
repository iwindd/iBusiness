"use client";
import React from 'react'
import { CartItem } from '../../../../../next-auth';
import { useSession } from 'next-auth/react';
import { CashierPageChildType } from '../../page';
import ConfirmButton from '@/app/components/confirm_button';
import { TableCell, TableRow } from '@mui/material';

interface ItemProps extends CartItem, CashierPageChildType {
  items: CartItem[]
}

export const Item = (props: ItemProps) => {
  const { data: session, update } = useSession();
  const [grow, setGrow] = React.useState<boolean>(false);

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

  const Property = (cb: (cart: CartItem[], updateCart: (cart: CartItem[]) => void) => void) => {
    const cart = session?.user.cart ? session.user.cart : []
    const updateCart = (items: CartItem[]) => {
      update({
        ...session,
        user: {
          ...session?.user,
          cart: items
        }
      })
    }

    return cb(cart, updateCart)
  }

  const onIncrease = () => Property((cart, update) => {
    const Product = cart.find(p => p.serial == props.serial && p.retail == session?.user.retail);
    if (Product) {
      Product.count++;

      if (Product.count <= 0) {
        const Index = cart.findIndex(p => p.serial == props.serial && p.retail == session?.user.retail);
        cart.splice(Index, 1)
      }
    }

    update(cart)
  })

  const onDecrease = () => Property((cart, update) => {
    const Product = cart.find(p => p.serial == props.serial && p.retail == session?.user.retail);
    if (Product) {
      Product.count--;

      if (Product.count <= 0) {
        const Index = cart.findIndex(p => p.serial == props.serial && p.retail == session?.user.retail);
        cart.splice(Index, 1)
      }
    }

    update(cart)
  })

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => Property((cart, update) => {
    const Product = cart.find(p => p.serial == props.serial);
    if (Product) {
      Product.count = Number(e.target.value)
    }

    update(cart)
  })

  React.useEffect(() => {
    setGrow(true)
    setTimeout(() => {
      setGrow(false)
    }, 200)
  }, [props.count])

  return (
    <TableRow
      className={( grow ? 'bg-red-100' : '')}
      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
    >
      <TableCell component="th" scope="row" >
        {props.serial}
      </TableCell>
      <TableCell >{props.title}</TableCell>
      <TableCell >{props.category}</TableCell>
      <TableCell >{(props.price).toLocaleString()}</TableCell>
      <TableCell >{(props.price*props.count).toLocaleString()}</TableCell>
      <TableCell >
        <div >
          <button className="btn btn-secondary join-item" onClick={onDecrease}>-</button>
          <input type="text" className="outline-none border-none w-14 text-center join-item " value={props.count} onChange={onChange} />
          <button className="btn btn-secondary join-item" onClick={onIncrease}>+</button>
        </div>
      </TableCell>
      <TableCell>
        <ConfirmButton
          className="btn btn-error"
          onClick={onDelete}
          label='ลบ'
          label2='ลบ ?'
        />
      </TableCell>
    </TableRow>
  )
}