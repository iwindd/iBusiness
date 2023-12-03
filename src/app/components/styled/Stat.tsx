import { Typography } from "@mui/material"
import React from "react"

const Stat = (props: {
  title: string,
  caption?: string,
  children?: React.ReactNode
}) => {
  return (
    <div className="w-full h-full border p-4 rounded">
      <Typography variant="h6">{props.title}</Typography>
      <Typography variant="caption">{props?.caption || "ไม่พบหมายเหตุ"}</Typography>
      {props?.children}
    </div>
  )
}

export default Stat