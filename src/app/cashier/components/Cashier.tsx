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
    <div className='container p-4 '>
      <form onSubmit={handleSubmit(onSubmit)} className='flex gap-2 w-full'>
        <input placeholder='รหัสสินค้า' className="input flex-grow input-bordered outline-none ring-0 focus:ring-0 ring-5" {...register("serial")} autoFocus />
        <button className='btn btn-primary'>เพิ่มสินค้า</button>
        <button type='button' className="btn btn-success">คิดเงิน</button>
      </form>
      <div className="controllers space-x-1 mt-2 flex">
        <button className="btn btn-error">ล้างตะกร้า</button>
      </div>
      <div className="divider"></div>

      <Controller />
    </div >
  )
}

export default Cashier