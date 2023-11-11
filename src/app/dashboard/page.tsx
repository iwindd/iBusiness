"use client";
import React from 'react'
import Stats from './components/stats'
import { useSession } from 'next-auth/react';
import { useQueryClient } from '@tanstack/react-query';
import Chart from './components/chart';

const Dashboard = () => {
  const session = useSession();
  const queryClient = useQueryClient();

  React.useEffect(() => {
    queryClient.refetchQueries({ queryKey: ['Stats'], type: 'active' })
  }, [session.data?.user.retail])

  return (
    <div>
      <div className="container px-6">
        <div className="grid grid-cols-12">
          <div className="col-span-9"><Stats /></div>
          <div className="col-span-3 row-span-2 ps-2">
            <section>Best Seller</section>
            <section>Activity</section>
          </div>
          <div className="col-span-9">
            <div className="divider"></div>

            <main>
              this is content
              <Chart/>
            </main>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard