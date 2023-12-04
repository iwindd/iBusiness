"use client";
import React from 'react'
import Stats from './components/stats'
import { useQuery } from '@tanstack/react-query';
import ProfitChart from './components/chart/profit';
import TimesChart from './components/chart/times';
import WeekChart from './components/chart/week';
import BestSellerTable from './components/helper/bestSeller';
import ActivityTable from './components/helper/activity';
import { getAnalysisData } from './action';
import { Activity } from '@prisma/client';
import { BestSellerItem } from './components/helper/action';

const Dashboard = () => {
  const { data, isLoading, error } = useQuery({
    staleTime: 1000 * 60 * 60 * 24,
    queryKey: ['AnalysisData'],
    queryFn: async () => {
      return await getAnalysisData();
    }
  })

  if (isLoading) return <p></p>
  if (error) return <p>Error </p>

  return (
    <div className="grid grid-cols-12">
      <div className="col-span-9"><Stats /></div>
      <div className="col-span-3 row-span-2 ps-2 space-y-4">
        <BestSellerTable data={data?.data?.bestSeller.data as BestSellerItem[]} />
        <ActivityTable activities={data?.data?.activities.data as Activity[]} />
      </div>
      <div className="col-span-9 h-96">
        <ProfitChart
          sold={data?.data?.sold as number[]}
          months={data?.data?.months as Date[]}
        />
      </div>
      <div className="col-span-9 h-96">
        <div className="grid grid-cols-2 h-96">
          <section className='h-96'><TimesChart times={data?.data?.times as number[]} /></section>
          <section className='h-96'><WeekChart week={data?.data?.week as number[]} /></section>
        </div>
      </div>
    </div>
  )
}

export default Dashboard