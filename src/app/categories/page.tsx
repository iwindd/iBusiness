"use client";
import React from 'react'
import CategoryTable from './components/table'
import PForm from './components/PForm';
import { Inputs } from './components/schema';
import { Typography, Paper, Box } from '@mui/material';

const Histories = () => {
  return (
    <div className="container p-4">
      <Box className='p-4 border'>
        <header>
          <Typography variant='h4'>ประเภทสินค้า</Typography>
        </header>
      </Box>
      <article>
      </article>
    </div>
  )
}

export default Histories