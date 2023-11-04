"use server";
import React from 'react'
import Prisma from '@/libs/prisma'
import { getServerSession } from '@/libs/session';
import { redirect } from 'next/navigation';
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
      <header className='flex justify-between'>
        <div>
          <h1 className='text-2xl'>รายละเอียด </h1>
          <p className='text-gray-500'>{new Intl.DateTimeFormat('th-TH', { timeZone: 'Asia/Bangkok', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(history?.createdAt))} </p>
        </div>
        <span className='text-xl'>#{history?.id.toLocaleString()}</span>
      </header>
      <section>
        <div className="stat">
          <div className="stat-title">หมายเหตุ</div>
          <div className="stat-value text-lg">{history?.note || "ไม่พบหมายเหตุ"}</div>
        </div>
      </section>
      <article className='stats w-full flex'>
        <div className="stat">
          <div className="stat-title">ราคา</div>
          <div className="stat-value text-lg">{history?.price.toLocaleString()} ฿</div>
        </div>
        <div className="stat">
          <div className="stat-title">ต้นทุน</div>
          <div className="stat-value text-lg">{history?.cost.toLocaleString()} ฿</div>
        </div>
        <div className="stat">
          <div className="stat-title">กำไร</div>
          <div className="stat-value text-lg">{history?.profit.toLocaleString()} ฿</div>
        </div>
        <div className="stat">
          <div className="stat-title">สินค้าทั้งหมด</div>
          <div className="stat-value text-lg">{history?.products.reduce((total, p) => total += p.count, 0)} รายการ</div>
        </div>
      </article>
      <div className="divider"></div>
      <section>
        <table className="table">
          <thead>
            <tr>
              <th>รหัสสินค้า</th>
              <th>ชื่อสินค้า</th>
              <th>ราคา</th>
              <th>ต้นทุน</th>
              <th>กำไร</th>
              <th>จำนวน</th>
            </tr>
          </thead>
          <tbody>
            {
              history?.products.map((p) => {
                return (
                  <tr>
                    <td>{p.serial}</td>
                    <td>{p.title}</td>
                    <td>{p.price.toLocaleString()} ฿</td>
                    <td>{p.cost.toLocaleString()} ฿</td>
                    <td>{(p.price - p.cost).toLocaleString()} ฿</td>
                    <td>{p.count.toLocaleString()} รายการ</td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
      </section>
    </>
  )
}

export default History