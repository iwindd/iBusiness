"use client";
import React, { Suspense, useEffect } from 'react'
import Stats from './dashboard/components/stats'
import { useQuery } from '@tanstack/react-query';
import ProfitChart from './dashboard/components/chart/profit';
import TimesChart from './dashboard/components/chart/times';
import WeekChart from './dashboard/components/chart/week';
import BestSellerTable from './dashboard/components/helper/bestSeller';
import ActivityTable from './dashboard/components/helper/activity';
import { getAnalysisData } from './dashboard/action';
import { Activity } from '@prisma/client';
import { BestSellerItem } from './dashboard/components/helper/action';
import { Box, Paper, Skeleton } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2/Grid2';

const Dashboard = () => {
  const [info, setInfo] = React.useState<{
    bestSeller: BestSellerItem[],
    activities: Activity[],
    months: Date[],
    sold: number[],
    profit: number[],
    cost: number[],
    times: number[],
    week: number[]
  }>({
    bestSeller: [],
    activities: [],
    months: [],
    sold: [],
    profit: [],
    cost: [],
    times: [],
    week: []
  });
  const { data, isLoading, error } = useQuery({
    staleTime: 1000 * 60 * 60 * 24,
    queryKey: ['AnalysisData'],
    queryFn: async () => {
      return await getAnalysisData();
    }
  })

  useEffect(() => {
    if (data?.data && data.success) {
      setInfo(data.data)
    }
  }, [data])

  if (error) return <p>Error </p>

  return (
    <></>
    /*<Grid container spacing={2}>
      <Stats />
    </Grid>
         <div className="grid lg:grid-cols-3 md:grid-cols-1 gap-2">
          <div className="col-span-2 space-y-2">
            
          </div>
          <div className="col-span-1 row-span-3 ">
            <div className="grid lg:grid-cols-1 sm:grid-cols-2 gap-2">
              {
                isLoading ? (
                  <>
                    <Skeleton variant="rectangular" className='h-80' />
                    <Skeleton variant="rectangular" className='h-80' />
                  </>
                ) : (
                  <>
                    <BestSellerTable data={info.bestSeller} />
                    <ActivityTable activities={info.activities} />
                  </>
                )
              }
            </div>
          </div>
          <div className="col-span-2">
            {
              isLoading ? (
                <>
                  <Skeleton variant="rectangular" className='h-80' />
                </>
              ) : (
                <Paper className='h-80'>
                  <ProfitChart
                      sold={info.sold}
                      months={info.months}
                  />
                </Paper>
              )
            }
    
          </div>
          <div className="col-span-2">
            {
              isLoading ? (
                <>
                  <Skeleton variant="rectangular" className='lg:h-80 sm:h-[40rem] grid lg:grid-cols-2 sm:grid-cols-1' />
                </>
              ) : (
                <Paper className='lg:h-80 sm:h-[40rem] grid lg:grid-cols-2 sm:grid-cols-1'>
                  <Box><TimesChart times={info.times} /></Box>
                  <Box><WeekChart week={info.week} /></Box>
                </Paper>
              )
            }
    
          </div>
        </div> */
  )
}

export default Dashboard