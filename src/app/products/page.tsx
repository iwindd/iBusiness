"use client";
import React from 'react'
import { getProduct } from './action'
import PForm from './components/PForm';
import { Inputs } from './components/schema';
import ProductTable from './components/table';

function Products() {
  const [Input, setInput] = React.useState<string>("");
  const [State, setState] = React.useState<boolean>(false);
  const [Serial, setSerial] = React.useState<string>("");
  const [NewItem, setNewItem] = React.useState<boolean>(false);
  const [Values, setValues] = React.useState<Inputs>({
    serial: "",
    title: "",
    price: 0,
    cost: 0,
    stock: 0,
    categoryId: 0
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (Input.length <= 0) return;

    const resp = await getProduct(Input);
    if (!resp.success) return;

    if (resp.data) {
      onManager(resp.data)
    } else {
      setNewItem(true);
      setSerial(Input);
      setState(true);
    }
  }

  const onManager = (payload: Inputs) => {
    setNewItem(false);
    setSerial(payload.serial);
    setValues({
      serial: payload.serial,
      title: payload.title,
      price: payload.price || 0,
      cost: payload.cost || 0,
      stock: payload.stock || 0,
      categoryId: payload.categoryId,
      id: payload.id as number
    });
    setState(true);

  }

  return (
    <>
      <PForm
        serial={Serial}
        state={State}
        setState={setState}
        values={Values}
        isNewItem={NewItem}
      />
      <div className="container p-4">
        <header >
          <form onSubmit={onSubmit} className='space-x-2 flex items-center w-full'>
            <input type="text" value={Input} onChange={e => setInput(e.target.value)} className="input w-full" placeholder='Search...' />
            <button disabled={Input.length <= 0} className="btn btn-primary">จัดการ</button>
          </form>
        </header>
        <div className="divider"></div>
        <main>
          <ProductTable
            search={Input}
            onManager={onManager}
          />
        </main>
      </div >
    </>
  )
}

export default Products