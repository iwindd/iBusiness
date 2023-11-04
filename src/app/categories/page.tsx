"use client";
import React from 'react'
import HistoryTable from './components/table'

const Histories = () => {
  const [search, setSearch] = React.useState<string>("")

  return (
    <div className="container p-4">
      <header className='flex justify-between items-center'>
        <section>
          <h1 className='text-xl'>ประวัติการขายสินค้า</h1>
        </section>
        <section className='ms-auto'>
          <input type="text" placeholder='ค้นหา...' value={search} onChange={(e) => setSearch(e.target.value)} className="input" />
        </section>
      </header>
      <div className="divider"></div>
      <HistoryTable search={search}/>
    </div>
  )
}

export default Histories