"use client";
import React from 'react'
import Stats from './components/stats'
import { useSession } from 'next-auth/react';
import { useQueryClient } from '@tanstack/react-query';

const Dashboard = () => {
  const session = useSession();
  const queryClient = useQueryClient();

  React.useEffect(() => {
    queryClient.refetchQueries({ queryKey: ['Stats'], type: 'active' })
  }, [session.data?.user.retail])

  return (
    <div>
      <div className="container px-6">
        <Stats />
      </div>
    </div>
  )
}

export default Dashboard