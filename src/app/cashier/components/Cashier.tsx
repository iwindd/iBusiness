"use client";
import React, { FormEvent, FormEventHandler, useRef } from 'react'
import { CashierPageChildType } from '../page';
import { useSession } from 'next-auth/react';
import ConfirmButton from '@/app/components/confirm_button';
import Payment from './childs/Payment';
import CashierInput from './Input';
import { useInterface } from '@/app/providers/InterfaceProvider';

const Cashier = ({ addProductToCart }: CashierPageChildType) => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const { data: session, update } = useSession();

  const onPayment = () => setIsOpen(true);
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
    <div className='container p-4 border border-b-0 '>
      <CashierInput 
        addProductToCart={addProductToCart}
      />
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