import React from 'react'
import { LineChart } from '@mui/x-charts';
import { useTheme } from '@mui/material';

const parseHour = (index: number) => {
  const hourRaw = (index++).toString();
  const hour = hourRaw == "24" ? "00:00" : hourRaw.length <= 1 ? `0${hourRaw}:00` : `${hourRaw}:00`;

  return hour
}


const TimesChart = ({ times }: {
  times: number[]
}) => {
  const [data, labels]: [number[], string[]] = [[], []];
  const theme = useTheme();

  times.map((time, index) => {
    if (time > 0) {
      data.push(time);
      labels.push(parseHour(index));
    }
  })

  
  if (data.length <= 6) {
    const start = (data.length > 0 ? data[0] : 0)
    for (let i = start; i < start+(6-data.length); i++) {
      data.push(0);
      labels.push(parseHour(i))
    }
  }

  return (
    <LineChart
      series={[
        { data: data, label: 'ยอดขาย', color: theme.palette.primary.main }
      ]}
      xAxis={[{
        scaleType: 'point',
        data: labels
      }]}
    />
  )
}

export default TimesChart