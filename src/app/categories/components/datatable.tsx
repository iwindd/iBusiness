import React, { useEffect } from 'react'
import { DataGrid, GridSortModel, GridFilterModel, GridRowParams } from '@mui/x-data-grid';
import { useQuery } from '@tanstack/react-query';
import { getCategories, saveCategory } from '@/app/categories/action';
import { Box, Button, Paper } from '@mui/material';
import { Add, Delete, ViewAgenda } from '@mui/icons-material';
import { Category } from '@prisma/client';
import Confirmation from './confirmation';
import AddDialog from './add';
import { useInterface } from '@/app/providers/InterfaceProvider';
import Link from 'next/link';
import Header from '@/app/components/header';
import CustomToolbar from '@/app/components/toolbar';

const columns = [
  { field: 'title', sortable: true, headerName: 'ประเภทสินค้า', flex: 3, editable: true }, {
    field: 'products',
    sortable: false,
    headerName: 'จำนวนสินค้า',
    flex: 1,
    editable: false,
    valueFormatter: (data: any) => {
      return ((data?.value?.length || 0) as number).toLocaleString()
    }
  }, {
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

const CategoryDataTable = () => {
  const [sortModel, setSortModel] = React.useState<GridSortModel>([]);

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
    queryKey: ["categories"],
    queryFn: async () => {
      return await getCategories(sortModel, paginationModel, filterModel);
    }
  })

  const onCommit = async (newData: any, oldData: any) => {
    const resp = await saveCategory({
      title: newData.title
    }, oldData.id);

    if (!resp.success) return oldData
    return newData
  }

  useEffect(() => {
    const fetchData = async () => {
      await refetch();
    };

    fetchData();
  }, [paginationModel, sortModel, filterModel, refetch])
  const [selectRow, setSelectRow] = React.useState<number>(0);
  const { setDialog } = useInterface();
  const onSelectRow = (params: GridRowParams) => setSelectRow(params.id as number)
  const deleteDialog = setDialog(Confirmation, {
    id: selectRow,
    title: ((data?.data || []) as Category[]).find(p => p.id == selectRow)?.title,
    refetch: refetch
  });

  const addDialog = setDialog(AddDialog, {
    refetch: refetch
  }, "sm")

  if (error) return <p>ERROR</p>

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <Paper className='p-2'>
        <Header title='รายการประเภทสินค้า' className='flex justify-end items-center gap-2'>
          <Button startIcon={<Add />} onClick={addDialog.onOpen} variant="outlined">
            เพิ่มรายการ
          </Button>
          {selectRow ? (
            <>
              <Link href={`products?categoryFilter=${selectRow}`}>
                <Button startIcon={<ViewAgenda />} variant="outlined">
                  ดูรายการสินค้า
                </Button>
              </Link>
              <Button startIcon={<Delete />} onClick={deleteDialog.onOpen} variant="outlined" color="error">
                ลบรายการ
              </Button>
            </>

          ) : null}
        </Header>
      </Paper>

      <Paper sx={{ height: 750, width: '100%' }} className="mt-2 ">
        <DataGrid
          loading={isLoading}
          rows={isLoading ? [] : data?.data as Category[]}
          columns={columns}
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

export default CategoryDataTable