import React from 'react'
import { GridColDef } from '@mui/x-data-grid';
import { useQueryClient } from '@tanstack/react-query';
import { getCategories, saveCategory } from '@/app/categories/action';
import { Paper } from '@mui/material';
import { Delete, ViewAgenda } from '@mui/icons-material';
import Confirmation from './confirmation';
import { useInterface } from '@/app/providers/InterfaceProvider';
import CustomToolbar from '../toolbar';
import SmartTable, { ContextMenu } from '@/app/components/SmartTable';
import { fDateT, fNumber } from '@/libs/formatter';

const columns = (): GridColDef[] => {
  return [
    {
      field: 'title',
      sortable: true,
      headerName: 'ประเภทสินค้า',
      flex: 3,
      editable: true
    },
    {
      field: 'products',
      sortable: false,
      headerName: 'จำนวนสินค้า',
      flex: 1,
      editable: false,
      valueFormatter: (data: any) => fNumber(data?.value?.length)
    },
    {
      field: 'createdAt',
      sortable: true,
      headerName: 'วันที่เพิ่ม',
      type: "number",
      flex: 1,
      editable: false,
      valueFormatter: (data: any) => fDateT(data.value)
    }
  ]
}

const context = (onDelete: () => void, rowId: number): ContextMenu[] => {
  return [
    { title: "ดูรายการทั้งหมด", Icon: ViewAgenda, props: {}, href: `products?categoryFilter=${rowId}`, close: true },
    { title: "ลบรายการ", Icon: Delete, props: {}, onClick: onDelete, close: true }
  ]
}

const CategoryDataTable = () => {
  const [selectRow, setSelectRow] = React.useState<number>(0);
  const { setDialog } = useInterface();
  const queryClient = useQueryClient()
  const Deleter = setDialog(Confirmation, {
    refetch: async () => {
      await queryClient.refetchQueries({ queryKey: ['categories'], type: 'active' })
    }
  });

  const onCommit = async (newData: any, oldData: any) => {
    const resp = await saveCategory({
      title: newData.title
    }, oldData.id);

    if (!resp.success) return oldData
    return newData
  }

  return (
    <>
      <Paper sx={{ height: 750, width: '100%' }} >
        <SmartTable
          burger={true}
          columns={columns()}
          context={context(Deleter.onOpen, selectRow)}
          selectRow={selectRow}
          setSelectRow={setSelectRow}
          fetch={getCategories}
          options={CustomToolbar}
          name={'categories'}
          processRowUpdate={onCommit}
        />
      </Paper>
    </>
  )
}

export default CategoryDataTable