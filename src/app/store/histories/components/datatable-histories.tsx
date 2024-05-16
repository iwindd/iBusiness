"use client";
import React from 'react'
import * as ff from '@/libs/formatter'
import Datatable from '@/components/datatable'
import { ViewAgendaTwoTone } from '@mui/icons-material';
import { paths } from '@/paths';
import { Category } from '@prisma/client';
import { getHistories } from '@/controllers/HistoryController';
import GridLinkAction from '@/components/GridLinkAction';

const HistoryDatatable = () => {
  const columns = [
    { field: 'createdAt', sortable: true, headerName: 'วันทำรายการ', flex: 1, editable: false, valueFormatter: (data: any) => ff.date(data.value) },
    { field: 'price', sortable: true, headerName: 'ราคา', flex: 1, editable: false, valueFormatter: (data: any) => ff.money(data.value) },
    { field: 'cost', sortable: true, headerName: 'ต้นทุน', flex: 1, editable: false, valueFormatter: (data: any) => ff.money(data.value) },
    { field: 'profit', sortable: true, headerName: 'กำไร', flex: 1, editable: false, valueFormatter: (data: any) => ff.money(data.value) },
    { field: 'productsText', sortable: false, headerName: 'สินค้า', flex: 1, editable: false, },
    { field: 'note', sortable: true, headerName: 'หมายเหตุ', flex: 1, editable: false, valueFormatter: (data: any) => ff.text(data.value) },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'เครื่องมือ',
      flex: 1,
      getActions: ({ row }: { row: Category }) => [
        <GridLinkAction key="view" to={`${paths.histories}/${row.id}`} icon={<ViewAgendaTwoTone />} label="ดูรายละเอียด" showInMenu />,
      ],
    }
  ]

  return (
    <>
      <Datatable
        name={'histories'}
        columns={columns}
        fetch={getHistories}
        height={700}
      />
    </>
  )
}

export default HistoryDatatable