"use server";
import React from 'react'
import Prisma from '@/libs/prisma'
import { getServerSession } from '@/libs/session';
import { redirect } from 'next/navigation';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Typography, IconButton } from '@mui/material';
import Stat from '@/app/components/styled/Stat';
import { Header } from '@/app/components/header';
import Link from 'next/link';
import { KeyboardArrowLeft } from '@mui/icons-material';

const HistoryHeader = ({ caption }: { caption: string }) => {
  return (
    <div className='flex items-center'>
      <Link href={"/histories"}>
        <IconButton>
          <KeyboardArrowLeft></KeyboardArrowLeft>
        </IconButton>
      </Link>
      <main>
        <Typography variant='h4'>รายละเอียด</Typography>
        <Typography variant='caption'>{caption}</Typography>
      </main>
    </div>
  )
}

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
      <Header
        header={
          <HistoryHeader
            caption={
              new Intl.DateTimeFormat('th-TH', {
                timeZone: 'Asia/Bangkok',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              }).format(new Date(history?.createdAt))
            }
          />
        }
        className='flex justify-end items-center'
      >
        <span className='text-xl'>#{history?.id.toLocaleString()}</span>
      </Header>
      <main className='mt-4'>
        <section>
          <Stat title='หมายเหตุ' caption={history.note || "ไม่พบหมายเหตุ"} >
            <Typography variant='caption'><i>-- ชื่อผู้ใช้ รหัสการสั่งจอง คำอธิบาย ข้อมูล คำชี้แจงเพิ่มเติม หรือ อื่นๆ</i></Typography>
          </Stat>
        </section>
        <article className='grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-2 mt-2'>
          <Stat title='ราคา' caption={history?.price.toLocaleString() + " ฿"} >
            <Typography variant='caption'><i>-- ราคารวมของรายการนี้</i></Typography>
          </Stat>
          <Stat title='ต้นทุน' caption={history?.cost.toLocaleString() + " ฿"} >
            <Typography variant='caption'><i>-- ต้นทุนของรายการนี้</i></Typography>
          </Stat>
          <Stat title='กำไร' caption={history?.profit.toLocaleString() + " ฿"} >
            <Typography variant='caption'><i>-- กำไรของรายการนี้</i></Typography>
          </Stat>
          <Stat title='สินค้าทั้งหมด' caption={history?.products.reduce((total, p) => total += p.count, 0) + " รายการ"} >
            <Typography variant='caption'><i>-- จำนวนสินค้าทั้งหมดภายในรายการนี้</i></Typography>
          </Stat>
        </article>
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
      </main>
    </>
  )
}

export default History