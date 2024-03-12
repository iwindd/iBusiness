"use client";
import { LocalizationProvider as LP } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const LocalizationProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <LP dateAdapter={AdapterDayjs}>
      {children}
    </LP>
  )
}

export default LocalizationProvider;