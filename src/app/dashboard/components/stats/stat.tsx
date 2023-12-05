import React from 'react'
import Link from 'next/link';
import { Typography } from '@mui/material';
import Stat from '@/app/components/styled/Stat';
interface Props {
  title: string,
  value: string,
  desc: string,
  route: string,
  icon: JSX.Element
}

const DashboardStat = (props: Props) => {
  return (
    <Link
      href={props.route}
      className='grow-1 flex-grow'
    >
      <Stat title={props.title} caption={props.value}>
        <Typography variant="caption"><i>-- {props.desc}</i></Typography>
      </Stat>
    </Link>
  )
}

export default DashboardStat