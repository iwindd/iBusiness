"use client";
import React, { FormEvent, FormEventHandler, useRef } from 'react'
import { CashierPageChildType } from '../page';
import { useSession } from 'next-auth/react';
import { Paper } from '@mui/material';
import ProductField from '@/app/components/productfield';
import { Option } from '@/app/components/productfield/selectize';

interface CashierProp extends CashierPageChildType{
  PaymentDialog: () => void
}

const Cashier = ({ addProductToCart, PaymentDialog }: CashierProp) => {
  const [serial, setSerial] = React.useState<string>("");
  const { data: session, update } = useSession();

  const onSubmit = async () => {
    if (serial.length <= 0) return;

    addProductToCart(serial);
    setSerial("");
  };

  const onSelected = async (product: Option) => {
    if (product.value.length <= 0) return;

    addProductToCart(product.value);
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== ' ') return;
    e.preventDefault();
    PaymentDialog();
  };


  return (
    <form onSubmit={(e) => {
      e.preventDefault()
      onSubmit()
    }}>
      <Paper className='border-none '>
        <ProductField onKeyDown={handleKeyDown}  onSelected={onSelected} addProductToCart={addProductToCart} />
      </Paper>
    </form>
  )
}

export default Cashier