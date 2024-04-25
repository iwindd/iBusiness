"use client";
import React from 'react'
import Favorite from './favorite'
import * as ff from '@/libs/formatter'
import Datatable from '@/components/datatable'
import { getProducts, setProductFavorite } from '@/controllers/ProductController';

const ProductDatatable = () => {
  const onToggleFavorite = async (id: number, state: boolean) => await setProductFavorite(id, state)

  const columns = [
    { field: 'favorite', sortable: true, headerName: "", renderCell: (e: any) => <Favorite onChange={(state: boolean) => onToggleFavorite(e.row.id, state)} default={e.row.favorite} /> },
    { field: 'serial', sortable: false, headerName: 'รหัสสินค้า', flex: 1 },
    { field: 'title', sortable: false, headerName: 'ชื่อสินค้า', flex: 1 },
    { field: 'keywords', sortable: true, headerName: 'คีย์เวิร์ด', flex: 1, valueFormatter: (data: any) => ff.text(data.value) },
    { field: 'price', sortable: true, headerName: 'ราคา', flex: 1, type: "number", valueFormatter: (data: any) => ff.money(data.value) },
    { field: 'cost', sortable: true, headerName: 'ต้นทุน', flex: 1, type: "number", valueFormatter: (data: any) => ff.money(data.value) },
    { field: 'stock', sortable: true, headerName: 'ของในสต๊อก', flex: 1, type: "number", valueFormatter: (data: any) => ff.number(data.value) }
  ]

  return (
    <Datatable
      name={'products'}
      columns={columns}
      fetch={getProducts}
      height={700}
    />
  )
}

export default ProductDatatable