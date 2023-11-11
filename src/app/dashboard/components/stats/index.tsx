"use client";
import React from 'react'
import Stat from './stat';
import { ArchiveBoxIcon, DocumentIcon } from '@heroicons/react/20/solid';
import { useQuery } from '@tanstack/react-query';
import { getDashboardStats } from './action';
import { Order } from '@prisma/client';
import { v4 } from 'uuid';

interface Stat {
  title: string,
  desc: string,
  route: string,
  icon: JSX.Element,
  format: (day: Order[], week: Order[], month: Order[], ProductOutOfStock: number, ProductOnStock: number) => string
}

const Items: Stat[] = [
  {
    title: "ยอดขายวันนี้", route: "/histories?scope=today", desc: "", icon: <DocumentIcon className='h-10 w-10' />, format: (day) => {
      return day.reduce((total, data) => total += data.price, 0).toLocaleString() + " ฿"
    }
  },
  {
    title: "ยอดขายอาทิตย์นี้", route: "/histories?scope=week", desc: "", icon: <DocumentIcon className='h-10 w-10' />, format: (_, week) => {
      return week.reduce((total, data) => total += data.price, 0).toLocaleString() + " ฿"
    }
  },
  {
    title: "ยอดขายเดือนนี้", route: "/histories?scope=month", desc: "", icon: <DocumentIcon className='h-10 w-10' />, format: (_, __, month) => {
      return month.reduce((total, data) => total += data.price, 0).toLocaleString() + " ฿"
    }
  },
  {
    title: "สินค้าไม่มีในสต๊อก", route: "/products?sort=stock&format=asc", desc: "จำนวนสินค้าที่ไม่มีของคงเหลือ", icon: <ArchiveBoxIcon className='h-10 w-10' />, format: (_, __, ___, outOfStock) => {
      return outOfStock.toLocaleString()
    }
  },
  {
    title: "สินค้าทั้งหมด", route: "/products", desc: "จำนวนสินค้าทั้งหมด", icon: <ArchiveBoxIcon className='h-10 w-10' />, format: (_, __, ___, outOfStock, stock) => {
      return (outOfStock + stock).toLocaleString()
    }
  }
]

const Stats = async () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['Stats'],
    queryFn: async () => {
      return await getDashboardStats()
    }
  })

  if (isLoading) return <p>Loading</p>
  if (error) return <p>ERROR</p>;

  return (
    <div className="stats w-full ">
      {
        Items.map((i) => {
          return (
            <Stat
              key={v4()}
              route={i.route}
              title={i.title}
              value={i.format(
                data?.data?.[0] || [], // day order
                data?.data?.[1] || [], // week order
                data?.data?.[2] || [], // month order
                data?.data?.[3] || 0, // out of stock products count
                data?.data?.[4] || 0 // on stock products count
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