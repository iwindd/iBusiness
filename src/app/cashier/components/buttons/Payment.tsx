"use client";
import React from 'react'
import { PaymentAction } from '../../action';
import { useSession } from 'next-auth/react';

const Payment = () => {
  const { data: session, update} = useSession();

  const onClick = async () => {
    const resp = await PaymentAction({
      type: 0,
      note: ""
    });

    if (!resp?.success) return;

    update({
      ...session,
      user: {
        ...session?.user,
        cart: []
      }
    })
  }

  return (
    <button
      className="btn btn-primary"
      onClick={onClick}
      disabled={(session?.user.cart || []).length <= 0}
    >
      payment
    </button>
  )
}

export default Payment