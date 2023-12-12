import React from 'react'
import StockProvider from './providers/StockProvider';

const StockLayout = ({ children }: { children: React.ReactNode }) => {
  return <StockProvider>{children}</StockProvider >
}

export default StockLayout