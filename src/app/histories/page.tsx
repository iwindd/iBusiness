"use client";
import React from 'react'
import Datatable from './components/datatable';

const Histories = () => {
  const [search, setSearch] = React.useState<string>("")
  
  return (
    <Datatable/>
  )
}

export default Histories