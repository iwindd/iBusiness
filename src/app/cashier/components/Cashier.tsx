"use client";
import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Inputs, Schema } from '../schema';
import { CashierPageChildType } from '../page';
import { useSession } from 'next-auth/react';
import ConfirmButton from '@/app/components/confirm_button';
import Payment from './buttons/Payment';

const Cashier = ({ addProductToCart }: CashierPageChildType) => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const { register, handleSubmit, reset, setFocus, watch } = useForm<Inputs>({
    resolver: zodResolver(Schema)
  })
  const serial = watch("serial")
  
  const { data: session, update } = useSession();
  const cart = session?.user.cart || []
  const onSubmit: SubmitHandler<Inputs> = async (payload) => {
    if (payload.serial.length <= 0) {
      return onPayment()
    }

    reset()
    addProductToCart(payload.serial);
    setFocus("serial");
  }

  const onPayment = () => setIsOpen(true)
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
      <Payment isOpen={isOpen} setIsOpen={setIsOpen} />
      <form onSubmit={handleSubmit(onSubmit)} className='flex gap-2 w-full'>
        <input
          placeholder='รหัสสินค้า'
          className="input flex-grow input-bordered outline-none ring-0 focus:ring-0 ring-5"
          {...register("serial")}
          autoFocus
        />

        {
          ((serial == undefined ? "" : serial).length > 0) ? (
            <button className='btn btn-primary'>เพิ่มสินค้า</button>
          ) : (
            <button className='btn btn-success' disabled={cart.length <= 0}>จ่ายเงิน</button>
          )
        }
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