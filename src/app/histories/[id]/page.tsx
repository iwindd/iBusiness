"use client";
import React, { useEffect, useRef, useState } from 'react'
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Typography, IconButton, Paper, Button } from '@mui/material';
import Stat from '@/app/components/styled/Stat';
import { Header } from '@/app/components/header';
import Link from 'next/link';
import { KeyboardArrowLeft } from '@mui/icons-material';
import { Order, OrderProduct } from '@prisma/client';
import { getHistory } from '../action';
import { useQuery } from '@tanstack/react-query';
import Receipter from './components/receipter';
import { useReactToPrint } from 'react-to-print';
import { useInterface } from '@/app/providers/InterfaceProvider';

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

  const [history, setHistory] = useState<Order | null>(null)
  const [products, setProducts] = useState<OrderProduct[]>([]);
  const receipterRef = useRef(null);
  const { data, error, isLoading } = useQuery({
    queryKey: ["history_detail"],
    queryFn: async () => {
      return await getHistory(id);
    }
  })

  const { setBackdrop } = useInterface();

  const handlePrint = useReactToPrint({
    documentTitle: "ใบกำกับภาษีอย่างย่อ",
    onBeforePrint: () => setBackdrop(true),
    onAfterPrint: () => setBackdrop(false),
    removeAfterPrint: true,
  });

  useEffect(() => {
    if (data?.success && data.data) {
      setHistory(data.data)
      setProducts(data.data.products)
    }else{
      
    }
  }, [data])

  const ReceiptExport = () => {
    handlePrint(null, () => receipterRef.current);
  }


  if (error) return <p>ERROR!</p>;
  if (isLoading ) return <p>Loading.</p>;
  if (!history) return <p>Loading..</p>;
  if (!products) return <p>Loading...</p>;
  if (products.length <= 0) return <p>Loading....</p>;

  const formatMoney = (amount : number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
    }).format(amount);
  }

  const formatNumber = (amount : number) => {
    return new Intl.NumberFormat('th-TH', {}).format(amount);
  }

  return (
    <>
      <div className='hidden'>
        <Receipter history={history} products={products} ref={receipterRef} />
      </div>
      <Button onClick={ReceiptExport}>ใบกำกับภาษีอย่างย่อ</Button>
      <Paper className='p-2 px-5'>
        <Header
          header={
            <HistoryHeader
              caption={
                history?.createdAt ? (new Intl.DateTimeFormat('th-TH', {
                  timeZone: 'Asia/Bangkok',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                }).format(new Date(history.createdAt))) : "..."
              }
            />
          }
          className='flex justify-end items-center'
        >
          <span className='text-xl'>#{formatNumber(history?.id) || 0}</span>
        </Header>
      </Paper>
      <main className='mt-2'>
        <section>
          <Stat title='หมายเหตุ' caption={history?.note || "ไม่พบหมายเหตุ"} >
            <Typography variant='caption'><i>-- ชื่อผู้ใช้ รหัสการสั่งจอง คำอธิบาย ข้อมูล คำชี้แจงเพิ่มเติม หรือ อื่นๆ</i></Typography>
          </Stat>
        </section>
        <article className='grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-2 mt-2'>
          <Stat title='ราคา' caption={formatNumber(history?.price)} >
            <Typography variant='caption'><i>-- ราคารวมของรายการนี้</i></Typography>
          </Stat>
          <Stat title='ต้นทุน' caption={formatNumber(history?.cost)} >
            <Typography variant='caption'><i>-- ต้นทุนของรายการนี้</i></Typography>
          </Stat>
          <Stat title='กำไร' caption={formatNumber(history?.profit)} >
            <Typography variant='caption'><i>-- กำไรของรายการนี้</i></Typography>
          </Stat>
          <Stat title='สินค้าทั้งหมด' caption={products?.reduce((total, p) => total += p.count, 0) + " รายการ"} >
            <Typography variant='caption'><i>-- จำนวนสินค้าทั้งหมดภายในรายการนี้</i></Typography>
          </Stat>
        </article>
        <Paper className='mt-2'>
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
                  products?.map((p) => {
                    return (
                      <TableRow key={p.id} className={p.overStock ? "bg-red-100" : ""}>
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
        </Paper>
      </main>
    </>
  )
}

export default History