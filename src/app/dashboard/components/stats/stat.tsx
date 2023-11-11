import React from 'react'

interface Props {
  title: string,
  value: string,
  desc: string,
  icon: JSX.Element
}

const Stat = (props: Props) => {
  return (
    <div className="stat">
      <div className="stat-figure text-secondary">
        {props.icon}
      </div>
      <div className="stat-title">{props.title}</div>
      <div className="stat-value">{props.value}</div>
      <div className="stat-desc">{props.desc}</div>
    </div>
  )
}

export default Stat