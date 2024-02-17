"use client";
import React, { FormEvent, FormEventHandler, useRef } from 'react'
import { CashierPageChildType } from '../page';
import { useSession } from 'next-auth/react';
import ConfirmButton from '@/app/components/confirm_button';
import CashierInput from './Input';
import { Divider } from '@mui/material';
import { Delete } from '@mui/icons-material';
import FavoritePage from './Favorite';

const Cashier = ({ addProductToCart }: CashierPageChildType) => {
  const { data: session, update } = useSession();

  const onClearCart = () => {
    update({
      ...session,
      user: {
        ...session?.user,
        cart: []
      }
    })
  }

  return (
    <>
      <CashierInput
        addProductToCart={addProductToCart}
      />
      <FavoritePage 
        addProductToCart={addProductToCart}
      />
      <div className="controllers space-x-1 mt-2 flex mb-2">
        <ConfirmButton
          className="btn btn-error"
          onClick={onClearCart}
          label="ล้างตะกร้า"
          label2="คุณต้องการจะล้างตะกร้าหรือไม่? สินค้าภายในตะกร้าจะถูกลบและไม่สามารถย้อนกลับได้!"
          variant='outlined'
          startIcon={<Delete />}
        />
      </div>

      <Divider />
    </>
  )
}

export default Cashier