"use client";
import React, { useState } from 'react'
import Favorite from './favorite'
import * as ff from '@/libs/formatter'
import Datatable from '@/components/datatable'
import { deleteProduct, getProducts, setProductFavorite } from '@/controllers/ProductController';
import { DeleteTwoTone, EditTwoTone, ViewAgendaTwoTone } from '@mui/icons-material';
import { paths } from '@/paths';
import { Category, Product } from '@prisma/client';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { useDialog } from '@/hooks/use-dialog';
import { ProductFormDialog } from './add-controller';
import { useInterface } from '@/app/providers/InterfaceProvider';
import { Confirmation, useConfirm } from '@/hooks/use-confirm';
import { useSnackbar } from 'notistack';
import { useQueryClient } from '@tanstack/react-query';
import GridLinkAction from '@/components/GridLinkAction';

const ProductDatatable = ({ categories }: { categories: Category[] }) => {
  const onToggleFavorite = async (id: number, state: boolean) => await setProductFavorite(id, state)
  const editDialog = useDialog();
  const { setBackdrop, isBackdrop } = useInterface();
  const { enqueueSnackbar } = useSnackbar();
  const [product, setProduct] = useState<Product | null>(null);
  const queryClient = useQueryClient();

  const confirmation = useConfirm({
    title: "แจ้งเตือน",
    text: "คุณต้องการที่จะลบสินค้าหรือไม่",
    onConfirm: async (id: number) => {
      try {
        const resp = await deleteProduct(id);

        if (resp.state) {
          enqueueSnackbar("ลบรายการสินค้าสำเร็จแล้ว!", { variant: "success" });
          await queryClient.refetchQueries({ queryKey: ['products'], type: 'active' })
        }
      } catch (error) {
        enqueueSnackbar("เกิดข้อผิดพลาดกรุณาลองใหม่อีกครั้งภายหลัง")
      }
    }
  })

  const menu = {
    edit: React.useCallback((product: Product) => () => {
      setProduct(product);
      editDialog.handleOpen();
    }, [editDialog, setProduct]),
    delete: React.useCallback((product: Product) => () => {
      confirmation.with(product.id);
      confirmation.handleOpen();
    }, [confirmation])
  }

  const columns = [
    { field: 'favorite', sortable: true, headerName: "", renderCell: (e: any) => <Favorite onChange={(state: boolean) => onToggleFavorite(e.row.id, state)} default={e.row.favorite} /> },
    { field: 'serial', sortable: false, headerName: 'รหัสสินค้า', flex: 1 },
    { field: 'title', sortable: false, headerName: 'ชื่อสินค้า', flex: 1 },
    { field: 'keywords', sortable: true, headerName: 'คีย์เวิร์ด', flex: 1, valueFormatter: (data: any) => ff.text(data.value) },
    { field: 'category', sortable: true, headerName: 'ประเภทสินค้า', flex: 1, valueFormatter: (data: any) => ff.text(data.value.title) },
    { field: 'price', sortable: true, headerName: 'ราคา', flex: 1, type: "number", valueFormatter: (data: any) => ff.money(data.value) },
    { field: 'cost', sortable: true, headerName: 'ต้นทุน', flex: 1, type: "number", valueFormatter: (data: any) => ff.money(data.value) },
    { field: 'stock', sortable: true, headerName: 'ของในสต๊อก', flex: 1, type: "number", valueFormatter: (data: any) => ff.number(data.value) },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'เครื่องมือ',
      flex: 1,
      getActions: ({ row }: { row: Product }) => [
        <GridLinkAction key="view" to={`${paths.products}/${row.id}`} icon={<ViewAgendaTwoTone />} label="ดูรายละเอียด" showInMenu />,
        <GridActionsCellItem key="edit" icon={<EditTwoTone />} onClick={menu.edit(row)} label="แก้ไข" showInMenu />,
        <GridActionsCellItem key="delete" icon={<DeleteTwoTone />} onClick={menu.delete(row)} label="ลบ" showInMenu />,
      ],
    }
  ]

  return (
    <>
      <Datatable
        name={'products'}
        columns={columns}
        fetch={getProducts}
        height={700}
      />

      <ProductFormDialog open={editDialog.open && !isBackdrop} onClose={editDialog.handleClose} setLoading={setBackdrop} product={product} categories={categories} />
      <Confirmation {...confirmation.props} />
    </>

  )
}

export default ProductDatatable