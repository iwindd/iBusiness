"use client";
import React from 'react'
import Cart from './components/Cart';
import { AddToCashier } from './action';
import { useSession } from 'next-auth/react';
import { useSnackbar } from 'notistack';
import Grid from '@mui/material/Unstable_Grid2/Grid2';
export interface CashierPageChildType {
  addProductToCart: (serial: string) => void
}

const CashierPage = () => {
  const { data: session, update } = useSession();
  const { enqueueSnackbar } = useSnackbar();

  const addProductToCart = async (serial: string) => {
    const resp = await AddToCashier({ serial });

    if (!resp.success) {
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

  const onClearCart = () => {
    update({
      ...session,
      user: {
        ...session?.user,
        cart: []
      }
    })
  }

/*   const PaymentDialog = setDialog(Payment, {
    session: session,
    clear: () => update({
      ...session,
      user: {
        ...session?.user,
        cart: []
      }
    })
  }); */

  return (
    <>
      <Grid container spacing={2}>
        <Grid xs={12}>
{/*           <Cashier
            addProductToCart={addProductToCart}
            PaymentDialog={PaymentDialog.onOpen}
          /> */}
        </Grid>
        <Grid xs={9}>
          <Cart addProductToCart={addProductToCart} />
        </Grid>
        <Grid>{/* 
          <Button variant="outlined" onClick={PaymentDialog.onOpen} color='success' endIcon={< PaymentOutlined />} >คิดเงิน</Button> */}
{/*           <ConfirmButton
            onClick={onClearCart}
            label="ล้างตะกร้า"
            label2="คุณต้องการจะล้างตะกร้าหรือไม่? สินค้าภายในตะกร้าจะถูกลบและไม่สามารถย้อนกลับได้!"
            variant='outlined'
            startIcon={<Delete />}
          /> */}
        </Grid>
      </Grid>
    </>
  )
}

export default CashierPage