"use client";
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { getProducts } from './action'
import { useRouter } from 'next/navigation';
import Link from 'next/link';

function Products() {
  const router = useRouter();
  const [Input, setInput] = React.useState<string>("");
  const { data } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      return await getProducts();
    }
  })

  const onSubmit = (e : React.FormEvent) => {
    e.preventDefault();
    if (Input.length <= 0) return;

    router.push(`/products/${Input}`);
    setInput("");
  }


  return (
    <div className="container p-4">
      <header className='flex justify-between'>
        <section className=' ms-auto'>
          <form onSubmit={onSubmit} className='space-x-2 flex items-center'>
            <input type="text" value={Input} onChange={e => setInput(e.target.value)} className="input" placeholder='Search...' />
            <button disabled={Input.length <= 0} className="btn btn-primary">เพิ่มสินค้า</button>
          </form>
        </section>
      </header>
      <main>
        <table className="table text-center">
          <thead>
            <tr>
              <th>Serial</th>
              <th>Title</th>
              <th>Price</th>
              <th>Cost</th>
              <th>Stock</th>
              <th>Tools</th>
            </tr>
          </thead>
          <tbody>
            {
              data?.data.map((product) => {
                return (
                  <tr key={product.serial}>
                    <td>{product.serial}</td>
                    <td>{product.title}</td>
                    <td>{product.price}</td>
                    <td>{product.cost}</td>
                    <td>{product.stock}</td>
                    <td>
                      <Link className="btn btn-primary" href={`/products/${product.serial}`}>จัดการ</Link>
                    </td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
      </main>
    </div>
  )
}

export default Products