import React from 'react'
import { BarChart } from '@mui/x-charts';
import { useTheme } from '@mui/material';

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
  const theme = useTheme()
  return (
    <BarChart
      series={[
        { data: week, label: 'ยอดขาย', color: theme.palette.primary.main }
      ]}
      xAxis={[{
        scaleType: 'band',
        data: weekLabels
      }]}
    />
  )
}

export default WeekChart