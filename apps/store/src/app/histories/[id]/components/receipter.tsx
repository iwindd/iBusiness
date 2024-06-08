import React from 'react'
import { Divider, Stack, Typography } from '@mui/material';
import { useSession } from 'next-auth/react';
import { money } from '@/libs/formatter';
import { ReceipterProps } from './receipter-controller';
import { notFound } from 'next/navigation';

export const Receipter = React.forwardRef<HTMLDivElement, ReceipterProps>((props, ref) => {
  const { data: session } = useSession();
  const address = session?.user.addressOBJ

  if (!props.history) return notFound();
  if (!props.products) return notFound();

  return (
    <Stack ref={ref} sx={{ width: 300, minHeight: 300 }} spacing={2}>
      <Stack flexDirection={"column"} alignItems={"center"}>
        <Typography variant='h3' >ทดสอบ</Typography>
        <Typography variant='caption'>{`${address?.provice} ${address?.area} ${address?.district} ${address?.etc} ${address?.postalcode}`}</Typography>
      </Stack>
      <Divider />
      <Stack flexDirection={'column'} alignItems={"center"} sx={{ px: 1, textAlign: "right" }}>
        <Typography variant='caption'>ใบเสร็จ / ใบกำกับภาษีอย่างย่อ</Typography>
        <table style={{ width: "100%" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left" }}><Typography variant='caption'><b>#</b></Typography></th>
              <th><Typography variant='caption'><b>ชื่อสินค้า</b></Typography></th>
              <th><Typography variant='caption'><b>ราคา</b></Typography></th>
            </tr>
          </thead>
          <tbody>
            {
              props.products.map((p, i) => {
                return (
                  <tr key={p.id}>
                    <td style={{ textAlign: "left" }}><Typography variant='caption'>{i + 1}</Typography></td>
                    <td><Typography variant='caption'>{p.title}</Typography></td>
                    <td><Typography variant='caption'>{money(p.price)}</Typography></td>
                  </tr>
                )
              })
            }
            <tr>
              <td colSpan={2} style={{ textAlign: "left" }}><Typography variant='caption'><b>รวมทั้งสิ้น</b></Typography></td>
              <td><Typography variant='caption'>{money(props.products.reduce((total, p) => total + p.price, 0))}</Typography></td>
            </tr>
          </tbody>
        </table>
      </Stack>
      <Divider />
      <Stack alignItems={'center'}>
        <Typography variant='caption'>ขอบคุณสำหรับการสั่งซื้อ :)</Typography>
      </Stack>
    </Stack>
  )
})

Receipter.displayName = "Receipt";

export default Receipter