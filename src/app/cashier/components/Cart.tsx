"use client";
import { useSession } from 'next-auth/react';
import React from 'react'
import { filterArrayByProperty } from '@/libs/utils';
import { Item } from './childs/CartItem';
import { CashierPageChildType } from '../page';

const Cart = (props: CashierPageChildType) => {
  const { data: session } = useSession();
  const Cart = session?.user.cart ? session.user.cart : [];

  return (
    <div className="container">
      <table className='table table-striped'>
        <thead>
          <tr>
            <th>รหัสสินค้า</th>
            <th>ชื่อสินค้า</th>
            <th>ราคา</th>
            <th>จำนวน</th>
            <th>เครื่องมือ</th>
          </tr>
        </thead>
        <tbody>
          {
            filterArrayByProperty(Cart, "serial").sort().map((product, index) => {
              return <Item
                key={`${product.serial}-${index}`}
                items={Cart}
                {...props}
                {...product}
              />
            })
          }
        </tbody>
      </table>
    </div>
  )
}

export default Cart