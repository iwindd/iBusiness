"use client";
import React from 'react'
import Stats from './components/stats'
import { useSession } from 'next-auth/react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import ProfitChart from './components/chart/profit';
import TimesChart from './components/chart/times';
import WeekChart from './components/chart/week';
import BestSellerTable from './components/helper/bestSeller';
import ActivityTable from './components/helper/activity';
import { getAnalysisData } from './action';

const Dashboard = () => {
  const session = useSession();

  const { data, isLoading, error } = useQuery({
    queryKey: ['AnalysisData'],
    queryFn: async () => {
      return await getAnalysisData();
    }
  })

  if (isLoading) return <p>Loading...</p>
  if (error) return <p>Error </p>

  console.table(data?.data)

  return (
    <div>
      <div className="container px-6">
        <div className="grid grid-cols-12">
          <div className="col-span-9"><Stats /></div>
          <div className="col-span-3 row-span-2 ps-2 space-y-2">
            <BestSellerTable />
            <ActivityTable />
          </div>
          <div className="col-span-9 h-96">
            <ProfitChart
              sold={data?.data?.sold as number[]}
              months={data?.data?.months as Date[]}
            />
          </div>
          <div className="col-span-9 h-96">
            <div className="grid grid-cols-2 h-96">
              <section className='h-96'><TimesChart times={data?.data?.times as number[]}/></section>
              <section className='h-96'><WeekChart week={data?.data?.week as number[]}/></section>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard