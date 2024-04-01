"use client";
import { Box, Paper, Tab } from '@mui/material'
import React from 'react'
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import StyledTabContext from '../components/styledTabContext';
import Datatable from './components/datatable';

const HistoriesPage = () => {
  const [value, setValue] = React.useState<string>('1');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Paper>
      <StyledTabContext value={value} >
        <Box sx={{ borderBottom: 1, borderTop: 0, borderColor: 'divider' }}>
          <TabList onChange={handleChange} >
            <Tab label="ประวัติการทำรายการ" value="1" />
          </TabList>
        </Box>
        <TabPanel value="1" sx={{ p: 0 }}><Datatable/></TabPanel>
      </StyledTabContext>
    </Paper >
  )
}

export default HistoriesPage