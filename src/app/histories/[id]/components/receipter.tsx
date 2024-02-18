import React from 'react'
import { Divider, Paper, Typography } from '@mui/material';
import { Order, OrderProduct } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { TheaterComedyRounded } from '@mui/icons-material';

type ReceipterProps = {
  products: OrderProduct[],
  history: Order | null
};

export const Receipter = React.forwardRef<HTMLDivElement, ReceipterProps>((props, ref) => {
  const { data: session } = useSession();
  const address = session?.user.addressOBJ

  if (!props.history) return <p>RENDERING...</p>
  if (!props.products) return <p>RENDERING...</p>

  const formatMoney = (amount : number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
    }).format(amount);
  }

  return (
    <>
      <div ref={ref} className='w-[300px] h-auto min-h-[300px] space-y-2'>
        <header className=' flex flex-col justify-center text-center'>
          <Typography variant='h1' className='text-2xl '>ทดสอบ</Typography>
          <Typography variant='caption'>{`${address?.provice} ${address?.area} ${address?.district} ${address?.etc} ${address?.postalcode}`}</Typography>
        </header>
        <Divider />
        <article className='flex justify-center flex-col text-center px-1'>
          <Typography variant='caption'>ใบเสร็จ / ใบกำกับภาษีอย่างย่อ</Typography>
          <table >
            <thead>
              <tr>
                <th className='text-left'><Typography variant='caption'><b>#</b></Typography></th>
                <th><Typography variant='caption'><b>ชื่อสินค้า</b></Typography></th>
                <th className='text-right'><Typography variant='caption'><b>ราคา</b></Typography></th>
              </tr>
            </thead>
            <tbody>
              {
                props.products.map((p, i) => {
                  return (
                    <tr>
                      <td className='text-left'><Typography variant='caption'>{i + 1}</Typography></td>
                      <td><Typography variant='caption'>{p.title}</Typography></td>
                      <td className='text-right'><Typography variant='caption'>{formatMoney(p.price)}</Typography></td>
                    </tr>
                  )
                })
              }
              <tr>
                <td colSpan={2} className='text-left'><Typography variant='caption'><b>รวมทั้งสิ้น</b></Typography></td>
                <td className='text-right'><Typography variant='caption'>{formatMoney(props.products.reduce((total, p) => total + p.price, 0))}</Typography></td>
              </tr>
            </tbody>
          </table>
        </article>
        <Divider />
        <footer className='flex justify-center'>
          <Typography variant='caption'>ขอบคุณสำหรับการสั่งซื้อ :)</Typography>
        </footer>
      </div>
    </>
  )
})

export default Receipter