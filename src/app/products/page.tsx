"use client";
import { Box, Paper, Tab } from '@mui/material'
import React from 'react'
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import StyledTabContext from '../components/styledTabContext';
import ProductDataTable from './components/products';
import Stock from './stock';

const ProductsPage = () => {
  const [value, setValue] = React.useState<string>('1');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Paper>
      <StyledTabContext value={value} >
        <Box sx={{ borderBottom: 1, borderTop: 0, borderColor: 'divider' }}>
          <TabList onChange={handleChange} >
            <Tab label="สินค้าทั้งหมด" value="1" />
            <Tab label="จัดการสต๊อก" value="2" />
          </TabList>
        </Box>
        <TabPanel value="1" sx={{ p: 0 }}><ProductDataTable /></TabPanel>
        <TabPanel value="2" sx={{ p: 0 }}><Stock /></TabPanel>
      </StyledTabContext>
    </Paper >
  )
}

export default ProductsPage