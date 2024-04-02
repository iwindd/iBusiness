import React from 'react'
import { Paper } from '@mui/material';
import { getHistories } from '../action';
import CustomToolbar from '@/app/components/toolbar';
import { ViewAgenda } from '@mui/icons-material';
import SmartTable, { ContextMenu } from '@/app/components/SmartTable';
import { fDateT, fMoney, fText } from '@/libs/formatter';

const columns = () => {
  return [
    {
      field: 'createdAt',
      sortable: true,
      headerName: 'วันทำรายการ',
      flex: 1,
      editable: false,
      valueFormatter: (data: any) => fDateT(data.value)
    },
    {
      field: 'price',
      sortable: true,
      headerName: 'ราคา',
      flex: 1,
      editable: false,
      valueFormatter: (data: any) => fMoney(data.value)
    },
    {
      field: 'cost',
      sortable: true,
      headerName: 'ต้นทุน',
      flex: 1,
      editable: false,
      valueFormatter: (data: any) => fMoney(data.value)
    },
    {
      field: 'profit',
      sortable: true,
      headerName: 'กำไร',
      flex: 1,
      editable: false,
      valueFormatter: (data: any) => fMoney(data.value)
    },
    {
      field: 'productsText',
      sortable: false,
      headerName: 'สินค้า',
      flex: 1,
      editable: false,
    },
    {
      field: 'note',
      sortable: true,
      headerName: 'หมายเหตุ',
      flex: 1,
      editable: false,
      valueFormatter: (data: any) => fText(data.value)
    }
  ]
}

const context = (rowId: number): ContextMenu[] => {
  return [
    { title: "ดูรายละเอียด", Icon: ViewAgenda, props: {}, href: `/histories/${rowId}`, close: true }
  ]
}

const Datatable = () => {
  const [selectRow, setSelectRow] = React.useState<number>(0);

  return (
    <>
      <Paper sx={{ height: 750, width: '100%' }} >
        <SmartTable
          columns={columns()}
          fetch={getHistories}
          burger={true}
          context={context(selectRow)}
          selectRow={selectRow}
          setSelectRow={setSelectRow}
          options={CustomToolbar}
          name={'categories'}
        />
      </Paper>
    </>
  )
}

export default Datatable