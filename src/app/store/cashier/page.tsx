"use client";
import React from 'react'
import Cart from './components/Cart';
import { AddToCashier } from './action';
import { useSession } from 'next-auth/react';
import { useSnackbar } from 'notistack';
import Grid from '@mui/material/Unstable_Grid2/Grid2';
import Cashier from './components/Cashier';
export interface CashierPageChildType {
  addProductToCart: (serial: string) => void
}

const CashierPage = () => {
  const [, setCart] = useRecoilState(CartState);

  const confirmation = useConfirm({
    title: "แจ้งเตือน",
    text: "คุณต้องการจะล้างตะกร้าหรือไม่? สินค้าภายในตะกร้าจะถูกลบและไม่สามารถย้อนกลับได้!",
    onConfirm: async () => setCart([]),
  });

  const onPayment = () => {
    
  }

  return (
    <>
      <Grid container spacing={2}>
        <Grid xs={12}>
          <Cashier onPayment={onPayment} /> 
        </Grid>
        <Grid xs={9}>
          <Cart />
        </Grid>
        <Grid>
          <Button onClick={confirmation.handleOpen}>ล้างตะกร้า</Button>
          <Confirmation {...confirmation.props} />
        </Grid>
      </Grid>
    </>
  )
}

export default CashierPage