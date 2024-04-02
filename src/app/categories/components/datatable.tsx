import React, { useEffect } from 'react'
import { DataGrid, GridSortModel, GridFilterModel, GridRowParams, GridColDef } from '@mui/x-data-grid';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getCategories, saveCategory } from '@/app/categories/action';
import { IconButton, MenuItem, Paper } from '@mui/material';
import { Delete, MoreVert, ViewAgenda } from '@mui/icons-material';
import { Category } from '@prisma/client';
import Confirmation from './confirmation';
import AddDialog from './add';
import { useInterface } from '@/app/providers/InterfaceProvider';
import StyledMenu from '@/app/components/styledMenu';
import Link from 'next/link';
import CustomToolbar from '../toolbar';
import SmartTable, { ContextMenu } from '@/app/components/SmartTable';

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
      valueFormatter: (data: any) => {
        return ((data?.value?.length || 0) as number).toLocaleString()
      }
    },
    {
      field: 'createdAt',
      sortable: true,
      headerName: 'วันที่เพิ่ม',
      type: "number",
      flex: 1,
      editable: false,
      valueFormatter: (data: any) => {
        return data.value ? new Intl.DateTimeFormat('th-TH', {
          timeZone: 'Asia/Bangkok',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }).format(new Date(data.value)) : "..."
      }
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
  const deleteDialog = setDialog(Confirmation, {
    id: selectRow,
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
          context={context(deleteDialog.onOpen, selectRow)}
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