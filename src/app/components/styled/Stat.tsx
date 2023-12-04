import { Paper, Typography } from "@mui/material"
import React from "react"

const Stat = (props: {
  title: string,
  caption?: string,
  children?: React.ReactNode
}) => {
  return (
    <Paper className="w-full h-full p-4 rounded">
      <Typography variant="h6">{props.title}</Typography>
      <Typography variant="body1">{props?.caption || "ไม่พบหมายเหตุ"}</Typography>
      {props?.children}
    </Paper>
  )
}

export default Stat