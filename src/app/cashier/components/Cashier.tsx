"use client";
import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Inputs, Schema } from '../schema';
import { CashierPageChildType } from '../page';
import Payment from './buttons/Payment';
import { useSession } from 'next-auth/react';
import ConfirmButton from '@/app/components/confirm_button';

const Cashier = ({ addProductToCart }: CashierPageChildType) => {
  const { register, handleSubmit, reset, setFocus } = useForm<Inputs>({
    resolver: zodResolver(Schema)
  })
  const { data: session, update } = useSession();

  const onSubmit: SubmitHandler<Inputs> = async (payload) => {
    reset()
    addProductToCart(payload.serial);
    setFocus("serial");
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

  return (
    <div className='container p-4 '>
      <form onSubmit={handleSubmit(onSubmit)} className='flex gap-2 w-full'>
        <input placeholder='รหัสสินค้า' className="input flex-grow input-bordered outline-none ring-0 focus:ring-0 ring-5" {...register("serial")} autoFocus />
        <div className="join">
          <button className='btn btn-primary join-item'>เพิ่มสินค้า</button>
          <Payment />
        </div>
      </form>
      <div className="controllers space-x-1 mt-2 flex">
        <ConfirmButton
          className="btn btn-error"
          onClick={onClearCart}
          label="ล้างตะกร้า"
          label2="SURE ?"
        />
      </div>
      <div className="divider"></div>
    </div >
  )
}

export default Cashier