import React from 'react'
import { BarChart } from '@mui/x-charts';

const weekLabels = [
  "อาทิตย์",
  "จันทร์",
  "อังคาร",
  "พุธ",
  "พฤหัสบดี",
  "ศุกร์",
  "เสาร์"
]

const WeekChart = ({ week }: {
  week: number[]
}) => {
  return (
    <BarChart
      series={[
        { data: week, label: 'ยอดขาย' }
      ]}
      xAxis={[{
        scaleType: 'band',
        data: weekLabels
      }]}
    />
  )
}

export default WeekChart