"use client";
import React from 'react'
import CategoryTable from './components/table'
import PForm from './components/PForm';
import { Inputs } from './components/schema';

const Histories = () => {
  const [search, setSearch] = React.useState<string>("")
  const [State, setState] = React.useState<boolean>(false);
  const [Target, setTarget] = React.useState<number>(0);
  const [NewItem, setNewItem] = React.useState<boolean>(false);
  const [Values, setValues] = React.useState<Inputs>({
    title: "",
  });

  const onNew = () => {
    setTarget(0);
    setNewItem(true)
    setValues({ title: "" })
    setState(true)
  }

  const onManage = (id: number, payload: Inputs) => {
    setTarget(id);
    setNewItem(false);
    setValues(payload);
    setState(true);
  }

  return (
    <>
      <PForm
        target={Target}
        state={State}
        setState={setState}
        values={Values}
        isNewItem={NewItem}
      />
      <div className="container p-4">
        <header className='flex justify-between items-center'>
          <section>
            <h1 className='text-xl'>ประเภทสินค้า</h1>
          </section>
          <section className='ms-auto join gap-2'>
            <input type="text" placeholder='ค้นหา...' value={search} onChange={(e) => setSearch(e.target.value)} className="input join-item" />
            <button className="btn btn-success join-item" onClick={onNew}>ใหม่</button>
          </section>
        </header>
        <div className="divider"></div>
        <CategoryTable
          search={search}
          onManage={onManage}
        />
      </div>
    </>
  )
}

export default Histories