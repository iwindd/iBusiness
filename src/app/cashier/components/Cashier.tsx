"use client";
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form';
import { AddToCashier } from '../action';
import { Inputs, Schema } from '../schema';
import Controller from './Controller';
import { CashierPageChildType } from '../page';

const Cashier = ({ addProductToCart }: CashierPageChildType) => {
  const { register, handleSubmit, reset, setFocus } = useForm<Inputs>({
    resolver: zodResolver(Schema)
  })

  const onSubmit: SubmitHandler<Inputs> = async (payload) => {
    reset()
    await addProductToCart(payload.serial);
    setFocus("serial");
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input placeholder='รหัสสินค้า' className="input input-bordred" {...register("serial")} autoFocus />
        <button className='btn btn-primary'>เพิ่มสินค้า</button>
      </form>

      <Controller />
    </>
  )
}

export default Cashier