import React from 'react'
import { LineChart } from '@mui/x-charts';

const TimesChart = () => {
  return (
    <LineChart
      series={[
        { data: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], label: 'ยอดขาย' }
      ]}
      xAxis={[{
        scaleType: 'point',
        data: [
          "6:00",
          "7:00",
          "9:00",
          "10:00",
          "11:00",
          "12:00",
          "13:00",
          "14:00",
          "15:00",
          "16:00",
          "17:00"
        ]
      }]}
    />
  )
}

export default TimesChart