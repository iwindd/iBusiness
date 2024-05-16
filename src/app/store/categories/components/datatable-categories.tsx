"use client";
import React, { useState } from 'react'
import * as ff from '@/libs/formatter'
import Datatable from '@/components/datatable'
import { deleteProduct, getProducts, setProductFavorite } from '@/controllers/ProductController';
import { DeleteTwoTone, EditTwoTone, ViewAgendaTwoTone } from '@mui/icons-material';
import { paths } from '@/paths';
import { Category, Product } from '@prisma/client';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { useDialog } from '@/hooks/use-dialog';
import { useInterface } from '@/app/providers/InterfaceProvider';
import { Confirmation, useConfirm } from '@/hooks/use-confirm';
import { useSnackbar } from 'notistack';
import { useQueryClient } from '@tanstack/react-query';
import { CategoryFormDialog } from './add-controller';
import { deleteCategory, getCategories } from '@/controllers/CategoryController';
import GridLinkAction from '@/components/GridLinkAction';

const CategoryDatatable = () => {
  const onToggleFavorite = async (id: number, state: boolean) => await setProductFavorite(id, state)
  const editDialog = useDialog();
  const { setBackdrop, isBackdrop } = useInterface();
  const { enqueueSnackbar } = useSnackbar();
  const [category, setCategory] = useState<Category | null>(null);
  const queryClient = useQueryClient();

  const confirmation = useConfirm({
    title: "แจ้งเตือน",
    text: "คุณต้องการที่จะลบประเภทสินค้าหรือไม่",
    onConfirm: async (id: number) => {
      try {
        const resp = await deleteCategory(id);

        if (resp.state) {
          enqueueSnackbar("ลบรายการประเภทสินค้าสำเร็จแล้ว!", { variant: "success" });
          await queryClient.refetchQueries({ queryKey: ['categories'], type: 'active' })
        }
      } catch (error) {
        enqueueSnackbar("เกิดข้อผิดพลาดกรุณาลองใหม่อีกครั้งภายหลัง")
      }
    }
  })

  const menu = {
    edit: React.useCallback((category: Category) => () => {
      setCategory(category);
      editDialog.handleOpen();
    }, [editDialog, setCategory]),
    delete: React.useCallback((category: Category) => () => {
      confirmation.with(category.id);
      confirmation.handleOpen();
    }, [confirmation])
  }

  const columns = [
    { field: 'title', sortable: true, headerName: 'ประเภทสินค้า', flex: 3, editable: true },
    { field: 'products', sortable: false, headerName: 'จำนวนสินค้า', flex: 1, editable: false, valueFormatter: (data: any) => ff.number(data?.value?.length) },
    { field: 'createdAt', sortable: true, headerName: 'วันที่เพิ่ม', type: "number", flex: 1, editable: false, valueFormatter: (data: any) => ff.date(data.value) },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'เครื่องมือ',
      flex: 1,
      getActions: ({ row }: { row: Category }) => [
        <GridLinkAction key="view" to={`${paths.categories}/${row.id}`} icon={<ViewAgendaTwoTone />} label="ดูรายละเอียด" showInMenu />,
        <GridActionsCellItem key="edit" icon={<EditTwoTone />} onClick={menu.edit(row)} label="แก้ไข" showInMenu />,
        <GridActionsCellItem key="delete" icon={<DeleteTwoTone />} onClick={menu.delete(row)} label="ลบ" showInMenu />,
      ],
    }
  ]

  return (
    <>
      <Datatable
        name={'categories'}
        columns={columns}
        fetch={getCategories}
        height={700}
      />

      <CategoryFormDialog open={editDialog.open} onClose={editDialog.handleClose} category={category} />
      <Confirmation {...confirmation.props} />
    </>

  )
}

export default CategoryDatatable