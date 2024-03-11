"use client";
import { Box, Paper, Tab } from '@mui/material'
import React from 'react'
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

const EmployeePage = () => {
  const [value, setValue] = React.useState<string>('1');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Paper>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} >
            <Tab label="จัดการพนักงาน" value="1" />
            <Tab label="ประวัติการเข้าทำงาน" value="2" />
            <Tab label="เพิ่มพนักงาน" value="3" />
            <Tab label="อื่นๆ" value="4" />
          </TabList>
        </Box>
        <TabPanel value="1">จัดการพนักงาน</TabPanel>
        <TabPanel value="2">ประวัติการเข้าทำงาน</TabPanel>
        <TabPanel value="3">เพิ่มพนักงาน</TabPanel>
        <TabPanel value="4">อื่นๆ</TabPanel>
      </TabContext>
    </Paper>
  )
}

export default EmployeePage