"use server";
import React from 'react'
import Prisma from '@/libs/prisma'
import { getServerSession } from '@/libs/session';
import { redirect } from 'next/navigation';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import Stat from '@/app/components/styled/Stat';

const History = async ({ params: { id } }: {
  params: {
    id: number
  }
}) => {
  const session = await getServerSession();
  const history = await Prisma.order.findFirst({
    where: {
      application: Number(session?.user.application),
      id: Number(id)
    },
    include: {
      products: true
    }
  })

  if (!history) {
    redirect("/histories");
  }

  return (
    <>
      <div className="divider"></div>
      <header className='flex justify-between mb-2'>
        <div>
          <h1 className='text-2xl'>รายละเอียด </h1>
          <p className='text-gray-500'>
            {new Intl.DateTimeFormat('th-TH', { timeZone: 'Asia/Bangkok', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(history?.createdAt))}
          </p>
        </div>
        <span className='text-xl'>#{history?.id.toLocaleString()}</span>
      </header>
      <section><Stat title='หมายเหตุ' caption={history.note || "ไม่พบหมายเหตุ"} /></section>
      <article className='w-full flex space-x-1 mt-1'>
        <Stat title='ราคา' caption={history?.price.toLocaleString() + " ฿"} />
        <Stat title='ต้นทุน' caption={history?.cost.toLocaleString() + " ฿"} />
        <Stat title='กำไร' caption={history?.profit.toLocaleString() + " ฿"} />
        <Stat title='สินค้าทั้งหมด' caption={history?.products.reduce((total, p) => total += p.count, 0) + " รายการ"} />
      </article>
      <div className="divider"></div>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>รหัสสินค้า</TableCell>
              <TableCell>ชื่อสินค้า</TableCell>
              <TableCell>ประเภทสินค้า</TableCell>
              <TableCell>ราคา</TableCell>
              <TableCell>ต้นทุน</TableCell>
              <TableCell>กำไร</TableCell>
              <TableCell>จำนวน</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              history?.products.map((p) => {
                return (
                  <TableRow key={p.id}>
                    <TableCell>{p.serial}</TableCell>
                    <TableCell>{p.title}</TableCell>
                    <TableCell>{p.category}</TableCell>
                    <TableCell>{p.price.toLocaleString()} ฿</TableCell>
                    <TableCell>{p.cost.toLocaleString()} ฿</TableCell>
                    <TableCell>{(p.price - p.cost).toLocaleString()} ฿</TableCell>
                    <TableCell>{p.count.toLocaleString()} รายการ</TableCell>
                  </TableRow>
                )
              })
            }
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}

export default History