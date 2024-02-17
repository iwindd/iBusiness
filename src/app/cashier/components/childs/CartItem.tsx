"use client";
import React from 'react'
import { CartItem } from '../../../../../next-auth';
import { useSession } from 'next-auth/react';
import { CashierPageChildType } from '../../page';
import ConfirmButton from '@/app/components/confirm_button';
import { TableCell, TableRow, IconButton } from '@mui/material';
import { Delete, Add, Remove } from '@mui/icons-material';

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

  const isOverstock = props.count > props.stock

  return (
    <TableRow
      className={(grow ? isOverstock ? 'bg-red-300' : 'bg-base-divider' : isOverstock ? "bg-red-100" : "")}
      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
    >
      <TableCell component="th" scope="row" >
        {props.serial}
      </TableCell>
      <TableCell >{props.title}</TableCell>
      <TableCell >{props.category}</TableCell>
      <TableCell >{(props.price).toLocaleString()}</TableCell>
      <TableCell >{(props.price * props.count).toLocaleString()}</TableCell>
      <TableCell >
        <div >
          <IconButton onClick={onDecrease}><Remove/></IconButton>
          <input type="text" className="outline-none border-none w-14 text-center join-item bg-transparent" value={props.count} onChange={onChange} />
          <IconButton onClick={onIncrease}><Add /></IconButton>
        </div>
      </TableCell>
      <TableCell>
        <ConfirmButton
          className={isOverstock ? "border-red-300 text-red-500 hover:border-red-700" : ""}
          onClick={onDelete}
          startIcon={<Delete />}
          variant='outlined'
          label='ลบ'
          label2={`คุณต้องการจะลบสินค้า ${props.title} ออกจากตะกร้าหรือไม่?`}
        />
      </TableCell>
    </TableRow>
  )
}