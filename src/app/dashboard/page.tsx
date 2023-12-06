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
import { Box, Paper } from '@mui/material';

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
    <div className="grid lg:grid-cols-3 md:grid-cols-1 gap-2">
      <div className="col-span-2 space-y-2">
        <Stats />
      </div>
      <div className="col-span-1 row-span-3 ">
        <div className="grid lg:grid-cols-1 sm:grid-cols-2 gap-2">
          <BestSellerTable data={data?.data?.bestSeller.data as BestSellerItem[]} />
          <ActivityTable activities={data?.data?.activities.data as Activity[]} />
        </div>
      </div>
      <div className="col-span-2">
        <Paper className='h-80'>
          <ProfitChart
            sold={data?.data?.sold as number[]}
            months={data?.data?.months as Date[]}
          />
        </Paper>
      </div>
      <div className="col-span-2">
        <Paper className='lg:h-80 sm:h-[40rem] grid lg:grid-cols-2 sm:grid-cols-1'>
          <Box><TimesChart times={data?.data?.times as number[]} /></Box>
          <Box><WeekChart week={data?.data?.week as number[]} /></Box>
        </Paper>
      </div>
    </div>
  )
}

export default Dashboard