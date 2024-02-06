"use client";
import React from 'react'
import Datatable from './components/datatable';
import Header from '@/app/components/header';
import { Paper } from '@mui/material';

const Histories = () => {
  return (
    <div style={{ height: '100%', width: '100%' }}>

      <Paper className='p-2'>
        <Header title='รายการประวัติการขาย'></Header>
      </Paper >
      
      <Datatable />
    </div>
  )
}

export default Histories