import React from 'react'
import { LineChart } from '@mui/x-charts';
import { useQuery } from '@tanstack/react-query';

const label_months = [
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

const ProfitChart = ({
  sold, months
}: {
  sold: number[],
  months: Date[]
}) => {
  return (
    <LineChart
      series={[
        { data: sold, label: 'ยอดขาย' }
      ]}
      xAxis={[{
        scaleType: 'point',
        data: months.map((date, i) => label_months[i]+" "+ (new Date().getFullYear() != date.getFullYear() ? date.getFullYear().toString().slice(2) : ""))
      }]}
    />
  )
}

export default ProfitChart