import React, { useEffect } from 'react'
import { DataGrid, GridSortModel, GridSortDirection, GridFilterModel, GridToolbarContainer, GridToolbarExport, GridRowParams, GridFilterForm, GridToolbarQuickFilter, GridToolbar } from '@mui/x-data-grid';
import { deleteProduct, getCategories, getProducts, saveProduct } from '../action';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { Inputs } from './schema';
import { Button } from '@mui/material';
import { Add, Delete, PlusOne } from '@mui/icons-material';
import { DialogProps, useInterface } from '@/app/providers/InterfaceProvider';
import { Product } from '@prisma/client';
import Confirmation from './confirmation';
import AddDialog from './add';


const ProductDataTable = () => {
  /* CATEGORY */
  const [categories, setCategories] = React.useState<any>([]);
  const [selectProduct, setSelectProduct] = React.useState<number>(0);
  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      return await getCategories()
    }
  })

  useEffect(() => {
    if (!categoriesData?.data) return
    setCategories(categoriesData.data);
  }, [categoriesData])

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

  const onCommit = async (newData: any, oldData: any) => {
    const resp = await saveProduct(newData, oldData.id);

    if (!resp.success) return oldData
    return newData
  }

  useEffect(() => { refetch() }, [paginationModel, sortModel, filterModel])

  const { useDialog } = useInterface();
  const onSelectRow = (params: GridRowParams) => setSelectProduct(params.id as number)
  const deleteDialog = useDialog(Confirmation, {
    id: selectProduct,
    title: ((data?.data || []) as Product[]).find(p => p.id == selectProduct)?.title,
    refetch: refetch
  });

  const addDialog = useDialog(AddDialog, {
    categories: categoriesData?.data || [],
    refetch: refetch
  }, "sm")

  if (error) return <p>ERROR</p>

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <section className='mb-2 flex justify-end'>
        <Button startIcon={<Add />} onClick={addDialog.onOpen}>
          Add
        </Button>
        {selectProduct ? (
          <Button startIcon={<Delete />} onClick={deleteDialog.onOpen}>
            Delete
          </Button>
        ) : null}
      </section>
      <DataGrid
        loading={isLoading}
        rows={data ? (data.success ? (data.data as Inputs[]) : []) : []}
        columns={[
          { field: 'serial', sortable: false, headerName: 'รหัสสินค้า', flex: 1 },
          { field: 'title', sortable: false, headerName: 'ชื่อสินค้า', flex: 1, editable: true },
          {
            field: 'categoryId',
            sortable: false,
            headerName: 'ประเภทสินค้า',
            flex: 1,
            valueOptions: categories.map((c: { id: number }) => c.id),
            valueFormatter: (params) => categories.find((cc: { id: number }) => cc.id == params.value).title || params.value,
            getOptionLabel: (id) => categories.find((cc: { id: number }) => cc.id == id).title || id,
            type: "singleSelect",
            editable: categories.length > 0,
          },
          { field: 'price', sortable: true, headerName: 'ราคา', flex: 1, type: "number", editable: true, valueFormatter: params => (params.value as number).toLocaleString() },
          { field: 'cost', sortable: true, headerName: 'ต้นทุน', flex: 1, type: "number", editable: true, valueFormatter: params => (params.value as number).toLocaleString() },
          { field: 'stock', sortable: true, headerName: 'ของในสต๊อก', flex: 1, type: "number", editable: true, valueFormatter: params => (params.value as number).toLocaleString() },

        ]}
        rowCount={data?.total}
        density="compact"

        onRowClick={onSelectRow}
        processRowUpdate={onCommit}

        pageSizeOptions={[15, 20]}
        paginationModel={paginationModel}
        paginationMode="server"
        onPaginationModelChange={setPaginationModel}

        sortingMode="server"
        onSortModelChange={setSortModel}

        disableColumnFilter
        disableColumnSelector
        disableDensitySelector
        slots={{
          toolbar: GridToolbar,
        }}
        slotProps={{ toolbar: { showQuickFilter: true } }}
        filterMode="server"
        filterModel={filterModel}
        onFilterModelChange={(newModel) => setFilterModel(newModel)}
      />
    </div>
  )
}

export default ProductDataTable