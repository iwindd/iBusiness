import React, { useEffect } from 'react'
import { BarChart } from '@mui/x-charts';
import { useTheme } from '@mui/material';
import { getDayWorkings } from '@/libs/time';

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
  const [labels, setLabels] = React.useState<string[]>(weekLabels);
  const [data, setData] = React.useState<number[]>([0, 0, 0, 0, 0, 0]);
  const [dayworks, setDayworks] = React.useState<boolean[]>([true, true, true, true, true, true, true])

  useEffect(() => {
    const fetching = async () => {
      const data = await getDayWorkings();

      setDayworks(data)
    }

    fetching()
  }, [])

  useEffect(() => {
    setData(data.map((number, index) => (
      dayworks[index] === true ? week[index] || number : NaN
    )).filter(number => !isNaN(number)));

    setLabels(weekLabels.map((label, index) => (
      dayworks[index] === true ? label : ""
    )).filter(label => label != ""));
  }, [dayworks, week, setData, data])



  return (
    <BarChart
      series={[
        { data: data, label: 'ยอดขาย', color: theme.palette.primary.main }
      ]}
      xAxis={[{
        scaleType: 'band',
        data: labels
      }]}
    />
  )
}

export default WeekChart