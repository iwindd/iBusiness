import React, { useEffect } from 'react'
import { DataGrid, GridSortModel, GridSortDirection, GridFilterModel, GridRowParams } from '@mui/x-data-grid';
import { getProducts, saveProduct, setFavorite } from '../action';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { Inputs } from './schema';
import { Box, Button, Paper } from '@mui/material';
import { Add, Delete, Inventory, QrCode } from '@mui/icons-material';
import { useInterface } from '@/app/providers/InterfaceProvider';
import { Category, Product } from '@prisma/client';
import Confirmation from './confirmation';
import AddDialog from './add';
import Header from '../../components/header';
import CustomToolbar from '../../components/toolbar';
import Link from 'next/link';
import Favorite from './favorite';
import { useBarcode } from 'next-barcode';
import { isValidEAN } from '@/libs/utils';
import { useSnackbar } from 'notistack';

const ProductDataTable = () => {
  /* BARCODE */
  const [barcode, setBarcode] = React.useState<string>("0000000000000");
  const { inputRef } = useBarcode({
    value: barcode,
    options: {
      format: "EAN13"
    }
  });

  const { enqueueSnackbar } = useSnackbar()

  /* CATEGORY */
  const [selectProduct, setSelectProduct] = React.useState<number>(0);
  const [products, setProducts] = React.useState<Product[]>([]);
  const [categories, setCategories] = React.useState<Category[]>([]);

  /* DATAGRID */
  const params = useSearchParams()
  const categoryFilter = params.get('categoryFilter');
  const sortParam = params.get('sort');
  const sortDirectionParam = params.get('format');

  const [sortModel, setSortModel] = React.useState<GridSortModel>((sortParam ? ([{
    field: sortParam as string,
    sort: sortDirectionParam as GridSortDirection
  }]) : ([])));

  const [paginationModel, setPaginationModel] = React.useState({
    pageSize: 15,
    page: 0,
  });

  const [filterModel, setFilterModel] = React.useState<GridFilterModel>({
    items: [],
    quickFilterExcludeHiddenColumns: true,
    quickFilterValues: [],
  });

  const { data, isLoading, refetch, error } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      return await getProducts(sortModel, paginationModel, filterModel, Number(categoryFilter));
    }
  })

  useEffect(() => {
    if (data?.data) {
      if (data.data) setProducts(data.data as Product[]);
      if (data.categories) setCategories(data.categories as Category[]);
    }
  }, [data])

  const onCommit = async (newData: any, oldData: any) => {
    const resp = await saveProduct(newData, oldData.id);

    if (!resp.success) return oldData
    return newData
  }

  useEffect(() => {
    const fetchData = async () => {
      await refetch()
    }

    fetchData()
  }, [paginationModel, sortModel, filterModel, refetch])

  const { setDialog } = useInterface();
  const onSelectRow = (params: GridRowParams) => setSelectProduct(params.id as number)
  const deleteDialog = setDialog(Confirmation, {
    id: selectProduct,
    title: "",
    refetch: refetch
  });

  const addDialog = setDialog(AddDialog, {
    categories: categories,
    refetch: refetch
  }, "lg")

  const onCreateQRCode = async () => {
    const product = products.find(p => p.id == selectProduct);
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

  if (error) return <p>ERROR</p>

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <canvas ref={inputRef} id='mybarcode' className='hidden' />
      <Paper className='p-2'>
        <Header title='รายการสินค้า' className='flex justify-end items-center gap-2'>
          <Button
            disabled={isLoading}
            startIcon={<Add />} onClick={addDialog.onOpen} variant="outlined">
            เพิ่มรายการ
          </Button>
          <Link href="/products/stock">
            <Button startIcon={<Inventory />} variant="outlined">
              จัดการสต๊อก
            </Button>
          </Link>
          {selectProduct ? (
            <>
              <Button disabled={isLoading} startIcon={<Delete />} onClick={deleteDialog.onOpen} variant="outlined" color="error">ลบรายการ</Button>
              <Button disabled={isLoading} startIcon={<QrCode />} onClick={onCreateQRCode} variant='outlined' color='info'>BARCODE</Button>
            </>
          ) : null}
        </Header>
      </Paper>

      <Paper sx={{ height: 750, width: '100%' }} className="mt-2 ">
        <DataGrid
          loading={isLoading}
          rows={products}

          columns={[
            {
              field: 'favorite', sortable: true, headerName: "",
              renderCell: (e) => {
                const onChange = (state: boolean) => {

                  setProducts((prev) => {
                    return [...prev].map(p => {
                      return {
                        ...p,
                        favorite: p.id == e.row.id ? state : p.favorite
                      }
                    })
                  })

                  return setFavorite(e.row.id, state)
                }

                return <Favorite onChange={onChange} default={e.row.favorite} />
              }
            },
            { field: 'serial', sortable: false, headerName: 'รหัสสินค้า', flex: 1 },
            { field: 'title', sortable: false, headerName: 'ชื่อสินค้า', flex: 1, editable: true },
            {
              field: 'categoryId', sortable: false, headerName: 'ประเภทสินค้า', flex: 1,
              valueOptions: categories?.map(c => c.id),
              valueFormatter: (params) => categories.find(c => c.id == params.value)?.title || "-",
              getOptionLabel: (id) => categories.find(c => c.id == id)?.title || "-",
              type: "singleSelect",
              editable: categories.length != undefined,
            },
            {
              field: 'keywords', sortable: true, headerName: 'คีย์เวิร์ด', flex: 1, editable: true,
              valueFormatter: (data: any) => data.value.length <= 0 ? "-" : data.value
            },
            { field: 'price', sortable: true, headerName: 'ราคา', flex: 1, type: "number", editable: true, valueFormatter: params => (params.value as number).toLocaleString() },
            { field: 'cost', sortable: true, headerName: 'ต้นทุน', flex: 1, type: "number", editable: true, valueFormatter: params => (params.value as number).toLocaleString() },
            { field: 'stock', sortable: true, headerName: 'ของในสต๊อก', flex: 1, type: "number", editable: true, valueFormatter: params => (params.value as number).toLocaleString() },
          ]}
          rowCount={data?.total}
          density="compact"

          onRowClick={onSelectRow}
          processRowUpdate={onCommit}

          pageSizeOptions={[15, 30, 50, 100]}
          paginationModel={paginationModel}
          paginationMode="server"
          onPaginationModelChange={setPaginationModel}

          sortingMode="server"
          onSortModelChange={setSortModel}

          disableColumnFilter
          disableColumnSelector
          disableDensitySelector
          slots={{
            toolbar: CustomToolbar,
          }}
          slotProps={{ toolbar: { showQuickFilter: true } }}
          filterMode="server"
          filterModel={filterModel}
          onFilterModelChange={(newModel) => setFilterModel(newModel)}
        />
      </Paper>

    </div>
  )
}

export default ProductDataTable