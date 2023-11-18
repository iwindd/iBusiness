"use client";
import { useSession } from 'next-auth/react';
import React from 'react'
import { Item } from './childs/CartItem';
import { CashierPageChildType } from '../page';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

const Cart = (props: CashierPageChildType) => {
  const { data: session } = useSession();
  const Cart = session?.user.cart ? session.user.cart : [];

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>รหัสสินค้า</TableCell>
            <TableCell>ชื่อสินค้า</TableCell>
            <TableCell>ประเภทสินค้า</TableCell>
            <TableCell>ราคา</TableCell>
            <TableCell>ราคา(รวม)</TableCell>
            <TableCell>จำนวน</TableCell>
            <TableCell>เครื่องมือ</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {
            Cart.sort()
              .filter(p => p.retail == session?.user.retail)
              .map((product, index) => {
                return (
                  <Item
                    key={`${product.serial}-${index}`}
                    items={Cart}
                    {...props}
                    {...product}
                  />
                )
              })
          }
        </TableBody>
      </Table>
    </TableContainer>

  )
}

export default Cart