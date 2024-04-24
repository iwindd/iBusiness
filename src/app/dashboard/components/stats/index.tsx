"use client";
import React, { useEffect } from 'react'
import Stat from './stat';
import { useQuery } from '@tanstack/react-query';
import { getDashboardStats } from './action';
import { Order } from '@prisma/client';
import { v4 } from 'uuid';
import { Skeleton } from '@mui/material';
import { Analytics } from '@mui/icons-material';

interface Stat {
  title: string,
  desc: string,
  route: string,
  icon: JSX.Element,
  format: (day: Order[], week: Order[], month: Order[], ProductOutOfStock: number, ProductOnStock: number) => string
}

const Items: Stat[] = [
  {
    title: "ยอดขายวันนี้", route: "/histories?scope=today", desc: "ยอดขายทั้งหมดภายในวันนี้", icon: <Analytics className='h-10 w-10' />, format: (day) => {
      return day.reduce((total, data) => total += data.price, 0).toLocaleString() + " ฿"
    }
  },
  {
    title: "ยอดขายสัปดาห์นี้", route: "/histories?scope=week", desc: "ยอดขายทั้งหมดภายในสัปดาห์นี้", icon: <Analytics className='h-10 w-10' />, format: (_, week) => {
      return week.reduce((total, data) => total += data.price, 0).toLocaleString() + " ฿"
    }
  },
  {
    title: "ยอดขายเดือนนี้", route: "/histories?scope=month", desc: "ยอดขายทั้งหมดภายในเดือนนี้", icon: <Analytics className='h-10 w-10' />, format: (_, __, month) => {
      return month.reduce((total, data) => total += data.price, 0).toLocaleString() + " ฿"
    }
  },
  {
    title: "สินค้าไม่มีในสต๊อก", route: "/products?sort=stock&format=asc", desc: "จำนวนสินค้าที่ไม่มีของคงเหลือ", icon: <Analytics className='h-10 w-10' />, format: (_, __, ___, outOfStock) => {
      return outOfStock.toLocaleString()
    }
  },
  {
    title: "สินค้าทั้งหมด", route: "/products", desc: "จำนวนสินค้าทั้งหมด", icon: <Analytics className='h-10 w-10' />, format: (_, __, ___, outOfStock, stock) => {
      return (outOfStock + stock).toLocaleString()
    }
  }
]

const Stats = () => {
  const [stats, setStats] = React.useState<[
    Order[],
    Order[],
    Order[],
    number,
    number
  ]>([[], [], [], 0, 0]);
  const { data, error, isLoading } = useQuery({
    queryKey: ['Stats'],
    queryFn: async () => {
      return await getDashboardStats()
    }
  })

  useEffect(() => {
    if (data?.success && data.data){
      setStats(data.data);
    }
  }, [data])

  if (error) return <p>ERROR</p>;


  return (
    <div className="grid lg:grid-cols-5 md:grid-cols-2 sm:grid-cols-1 gap-2">
      {
        Items.map((i) => {
          if (isLoading) return <Skeleton variant="rectangular" className=' h-24 '/>

          return (
            <Stat
              key={v4()}
              route={i.route}
              title={i.title}
              value={i.format(
                stats[0], // day order
                stats[1], // week order
                stats[2], // month order
                stats[3], // out of stock products count
                stats[4] // on stock products count
              )}
              desc={i.desc}
              icon={i.icon}
            />
          )
        })
      }
    </div>
  )
}

export default Stats