import React, { useEffect } from 'react'
import { LineChart } from '@mui/x-charts';
import { useTheme } from '@mui/material';

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

const ProfitChart = (data: {
  sold: number[],
  months: Date[]
}) => {
  const theme = useTheme();
  const [months, setMonths] = React.useState<Date[]>([]);
  const [sold, setSold] = React.useState<number[]>(new Array(12).fill(0));

  useEffect(() => {
    const payload = [...data.sold].concat(new Array(12 - [...data.sold].length).fill(0));
    const months_payload = [...data.months].concat(new Array(12 - [...data.months].length).fill(new Date()));
    const solds: number[] = payload.reverse();
    const firstNonZeroIndex: number = solds.findIndex(n => n !== 0);
    const filteredSold: number[] =
      firstNonZeroIndex !== -1 ? solds.slice(firstNonZeroIndex).reverse() : payload;

    setSold(filteredSold);
    setMonths(months_payload.slice(0, filteredSold.length));
  }, [data.sold]);

  const formattedMonths = months.map((date, i) => {
    const year = date.getFullYear() !== new Date().getFullYear() ? date.getFullYear().toString().slice(2) : '';
    return `${label_months[i]} ${year}`;
  });

  return (
    <LineChart
      series={[
        { data: sold, label: 'ยอดขาย', color: theme.palette.primary.main }
      ]}
      xAxis={[{
        scaleType: 'point',
        data: formattedMonths
      }]}
    />
  );
}

export default ProfitChart