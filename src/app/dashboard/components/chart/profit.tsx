import React from 'react'
import { LineChart } from '@mui/x-charts';

const ProfitChart = () => {
  return (
    <LineChart
      series={[
        { data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], label: 'กำไร' }
      ]}
      xAxis={[{
        scaleType: 'point',
        data: [
          "มกราคม",
          "กุมภาพันธ์",
          "มีนาคม",
          "เมษายน",
          "พฤษภาคม",
          "มิถุนายน",
          "กรกฎาคม",
          "สิงหาคม",
          "กันยายน",
          "ตุลาคม",
          "พฤศจิกายน",
          "ธันวาคม"
        ]
      }]}
    />
  )
}

export default ProfitChart