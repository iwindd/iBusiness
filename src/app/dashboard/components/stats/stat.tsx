import React from 'react'
import Link from 'next/link';

interface Props {
  title: string,
  value: string,
  desc: string,
  route: string,
  icon: JSX.Element
}

const Stat = (props: Props) => {
  return (
    <Link
      href={props.route}
      className="stat hover:bg-base-200 transition-all duration-250"
    >
      <div className="stat-figure text-secondary">
        {props.icon}
      </div>
      <div className="stat-title">{props.title}</div>
      <div className="stat-value">{props.value}</div>
      <div className="stat-desc">{props.desc}</div>
    </Link>
  )
}

export default Stat