"use client";
import React from 'react'
import Cart from './components/Cart';
import Cashier from './components/Cashier';
import { AddToCashier } from './action';
import { useSession } from 'next-auth/react';
import { useSnackbar } from 'notistack';
import ConfirmButton from '../components/confirm_button';
import { Delete, PaymentOutlined } from '@mui/icons-material';
import { Button, Divider } from '@mui/material';
import { useInterface } from '../providers/InterfaceProvider';
import Payment from './components/childs/Payment';

export interface CashierPageChildType {
  addProductToCart: (serial: string) => void
}

const CashierPage = () => {
  const { data: session, update } = useSession();
  const { enqueueSnackbar } = useSnackbar();
  const { setDialog } = useInterface();

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


  const onClearCart = () => {
    update({
      ...session,
      user: {
        ...session?.user,
        cart: []
      }
    })
  }

  const PaymentDialog = setDialog(Payment, {
    session: session,
    clear: () => update({
      ...session,
      user: {
        ...session?.user,
        cart: []
      }
    })
  });

  return (
    <>
      <div className="grid grid-cols-12">
        <div className="col-span-12 mb-2 space-y-2">
          <Cashier
            addProductToCart={addProductToCart}
            PaymentDialog={PaymentDialog.onOpen}
          />
        </div>

        <div className="col-span-12 grid grid-cols-12 gap-1">
          <div className="col-span-9">
            <Cart addProductToCart={addProductToCart} />
          </div>

          <div className="col-span-3 space-x-1">
            <Button variant="outlined" onClick={PaymentDialog.onOpen} color='success' endIcon={< PaymentOutlined />} >คิดเงิน</Button>
            <ConfirmButton
              onClick={onClearCart}
              label="ล้างตะกร้า"
              label2="คุณต้องการจะล้างตะกร้าหรือไม่? สินค้าภายในตะกร้าจะถูกลบและไม่สามารถย้อนกลับได้!"
              variant='outlined'
              startIcon={<Delete />}
            />

          </div>
        </div>
      </div>
      {/*     
       */}
    </>
  )
}

export default CashierPage