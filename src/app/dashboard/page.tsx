"use client";
import React from 'react'
import Stats from './components/stats'
import { useSession } from 'next-auth/react';
import { useQueryClient } from '@tanstack/react-query';
import ProfitChart from './components/chart/profit';
import TimesChart from './components/chart/times';
import WeekChart from './components/chart/week';
import BestSellerTable from './components/helper/bestSeller';
import ActivityTable from './components/helper/activity';

const Dashboard = () => {
  const session = useSession();

  return (
    <div>
      <div className="container px-6">
        <div className="grid grid-cols-12">
          <div className="col-span-9"><Stats /></div>
          <div className="col-span-3 row-span-2 ps-2 space-y-2">
            <BestSellerTable/>
            <ActivityTable/>
          </div>
          <div className="col-span-9 h-96">
            <div className="grid grid-cols-2 h-full">
              <section className='h-full'><TimesChart /></section>
              <section className='h-full'><WeekChart /></section>
            </div>
          </div>
          <div className="col-span-9 h-96"><ProfitChart /></div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard