"use client";
import { useSession } from 'next-auth/react';
import React from 'react'
import { Item } from './childs/CartItem';
import { CashierPageChildType } from '../page';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

const Cart = (props: CashierPageChildType) => {
  const { data: session } = useSession();
  const Cart = session?.user.cart ? session.user.cart : [];

  const items = Cart.sort().filter(p => p.retail == session?.user.retail)

  return (
    <TableContainer component={Paper} className='mt-4'>
      <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell variant="head">รหัสสินค้า</TableCell>
            <TableCell variant="head">ชื่อสินค้า</TableCell>
            <TableCell variant="head">ประเภทสินค้า</TableCell>
            <TableCell variant="head">ราคา</TableCell>
            <TableCell variant="head">ราคา(รวม)</TableCell>
            <TableCell variant="head">จำนวน</TableCell>
            <TableCell variant="head">เครื่องมือ</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {
            items.length > 0 ? (
              items.map((product, index) => {
                return (
                  <Item
                    key={`${product.serial}-${index}`}
                    items={Cart}
                    {...props}
                    {...product}
                  />
                )
              })
            ):(
              <TableRow>
                <TableCell colSpan={7} variant='footer' align='center' >ไม่มีสินค้าภายในตะกร้า</TableCell>
              </TableRow>
            )
          }
        </TableBody>
      </Table>
    </TableContainer>

  )
}

export default Cart