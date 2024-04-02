"use client";
import React, { useEffect } from 'react'
import { GridColDef } from '@mui/x-data-grid';
import { getProducts, setFavorite } from '../action';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Paper } from '@mui/material';
import { Delete, QrCode } from '@mui/icons-material';
import { useInterface } from '@/app/providers/InterfaceProvider';
import { Category, Product } from '@prisma/client';
import { useBarcode } from 'next-barcode';
import { isValidEAN } from '@/libs/utils';
import { useSnackbar } from 'notistack';
import Confirmation from './confirmation';
import Favorite from './favorite';
import CustomToolbar from '../toolbar';
import SmartTable, { ContextMenu } from '@/app/components/SmartTable';
import { fMoney, fNumber, fText } from '@/libs/formatter';
import { getAllCategories } from '@/app/categories/action';
import { useSearchParams } from 'next/navigation';

const columns = (
  onToggleFavorite: (id: number, state: boolean) => void,
  categories: Category[]
): GridColDef[] => {
  return [
    { field: 'favorite', sortable: true, headerName: "", renderCell: (e: any) => <Favorite onChange={(state: boolean) => onToggleFavorite(e.row.id, state)} default={e.row.favorite} /> },
    { field: 'serial', sortable: false, headerName: 'รหัสสินค้า', flex: 1 },
    { field: 'title', sortable: false, headerName: 'ชื่อสินค้า', flex: 1, editable: true },
    {
      field: 'categoryId', sortable: false, headerName: 'ประเภทสินค้า', flex: 1,
      valueOptions: categories?.map(c => c.id),
      valueFormatter: (data: any) => fText(categories.find(c => c.id == data.value)?.title),
      getOptionLabel: (id: any) => fText(categories.find(c => c.id == id)?.title),
      type: "singleSelect",
      editable: categories.length > 0,
    },
    { field: 'keywords', sortable: true, headerName: 'คีย์เวิร์ด', flex: 1, editable: true, valueFormatter: (data: any) => fText(data.value) },
    { field: 'price', sortable: true, headerName: 'ราคา', flex: 1, type: "number", editable: true, valueFormatter: (data: any) => fMoney(data.value) },
    { field: 'cost', sortable: true, headerName: 'ต้นทุน', flex: 1, type: "number", editable: true, valueFormatter: (data: any) => fMoney(data.value) },
    { field: 'stock', sortable: true, headerName: 'ของในสต๊อก', flex: 1, type: "number", editable: true, valueFormatter: (data: any) => fNumber(data.value) }
  ]
}

const context = (onCreateQRCode: (payload: Product) => void, onDelete: (payload: Product) => void): ContextMenu[] => {
  return [
    { title: "Barcode", Icon: QrCode, props: {}, onClick: onCreateQRCode, close: true },
    { title: "ลบรายการ", Icon: Delete, props: {}, onClick: onDelete, close: true }
  ]
}

const ProductDataTable = () => {
  const { enqueueSnackbar } = useSnackbar()
  const queryClient = useQueryClient()
  const params = useSearchParams()

  /* BARCODE */
  const [barcode, setBarcode] = React.useState<string>("0000000000000");
  const { inputRef } = useBarcode({
    value: barcode,
    options: {
      format: "EAN13"
    }
  });

  /* CATEGORY */
  const [categories, setCategories] = React.useState<Category[]>([]);
  const categoryFilter = params.get('categoryFilter');

  const { data } = useQuery({
    queryKey: ["categories3"],
    queryFn: async () => {
      return await getAllCategories();
    }
  })

  useEffect(() => {
    if (data?.categories) {
      if (data.categories) setCategories(data.categories as Category[]);
    }
  }, [data])

  /* FAVORITE */
  const onToggleFavorite = async (id: number, state: boolean) => {
    await setFavorite(id, state)
    await queryClient.refetchQueries({ queryKey: ['products'], type: 'active' })
  }

  /* DIALOG */
  const { setDialog } = useInterface();
  const Deleter = setDialog(Confirmation, { refetch: async () => await queryClient.refetchQueries({ queryKey: ['products'], type: 'active' }) });

  /* QRCODE */
  const onCreateQRCode = async (product: Product) => {
    if (!product) return enqueueSnackbar("ไม่พบสินค้าที่จะทำ Barcode", { variant: "error" });
    if (!isValidEAN(product.serial)) return enqueueSnackbar("Serial ของสินค้าไม่ถูกต้องที่จะทำ Barcode", { variant: "error" });
    await setBarcode(product.serial);
    const canvas = document.getElementById("mybarcode") as HTMLCanvasElement;
    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
    let downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = `${product.title}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    enqueueSnackbar("Barcode created!", { variant: "success" });
  }

  return (
    <>
      <canvas ref={inputRef} id='mybarcode' className='hidden' />
      <Paper sx={{ height: 840, width: '100%' }} >
        <SmartTable
          columns={columns(onToggleFavorite, categories)}
          burger={true}
          fetch={getProducts}
          bridge={[Number(categoryFilter)]}
          context={context(onCreateQRCode, Deleter.onOpen)}
          options={CustomToolbar}
          name={'products'}
        />
      </Paper>
    </>
  )
}

export default ProductDataTable