import React from 'react'
import { BarChart } from '@mui/x-charts';

const WeekChart = () => {
  return (
    <BarChart
      series={[
        { data: [1,2,3,4,5,6,7], label: 'ยอดขาย' }
      ]}
      xAxis={[{
        scaleType: 'band',
        data: [
          "อาทิตย์",
          "จันทร์",
          "อังคาร",
          "พุธ",
          "พฤหัสบดี",
          "ศุกร์",
          "เสาร์"
        ]
      }]}
    />
  )
}

export default WeekChart