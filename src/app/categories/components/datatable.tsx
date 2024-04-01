import React, { useEffect } from 'react'
import { DataGrid, GridSortModel, GridFilterModel, GridRowParams } from '@mui/x-data-grid';
import { useQuery } from '@tanstack/react-query';
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

const CategoryDataTable = () => {
  const [selectRow, setSelectRow] = React.useState<number>(0);
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [total, setTotal] = React.useState<number>(0);

  /* MENU */
  const [contextMenu, setContextMenu] = React.useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);

  const controller = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    setSelectRow(Number(event.currentTarget.getAttribute('data-id')));
    setContextMenu(
      contextMenu === null
        ? { mouseX: event.clientX - 2, mouseY: event.clientY - 4 }
        : null,
    );

  };

  const handleClose = () => {
    setContextMenu(null);
  };


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
      setContextMenu(null)
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
  }, [paginationModel, sortModel, filterModel])

  useEffect(() => {
    if (data?.success){
      setCategories(data.data as Category[]);
      setTotal(data.total)
    }
  })

  const { setDialog } = useInterface();
  const onSelectRow = (params: GridRowParams) => setSelectRow(params.id as number)
  const deleteDialog = setDialog(Confirmation, {
    id: selectRow,
    title: ((data?.data || []) as Category[]).find(p => p.id == selectRow)?.title,
    refetch: refetch
  });

  if (error) return <p>ERROR</p>

  return (
    <>
      <Paper sx={{ height: 750, width: '100%' }} >
        <DataGrid
          loading={isLoading}
          rows={categories}
          columns={[
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
            },
            {
              field: 'tool', sortable: true, headerName: "", flex: 1, editable: false,
              renderCell: (e) => {
                return (
                  <>
                    <IconButton
                      onClick={controller}
                      className='mx-4'
                      disableRipple
                    >
                      <MoreVert />
                    </IconButton>
                  </>
                )
              }
            }
          ]}
          rowCount={total}
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
          slotProps={{
            row: {
              toolbar: { showQuickFilter: true },
              onContextMenu: controller,
              style: { cursor: 'context-menu' },
            },
          }}
          filterMode="server"
          filterModel={filterModel}
          onFilterModelChange={(newModel) => setFilterModel(newModel)}
        />
      </Paper>
      <StyledMenu
        open={contextMenu !== null}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
        slotProps={{
          root: {
            onContextMenu: (e) => {
              e.preventDefault();
              handleClose();
            },
          },
        }}
      >
        <MenuItem disableRipple ><ViewAgenda /><Link href={`products?categoryFilter=${selectRow}`}>ดูรายการทั้งหมด</Link></MenuItem>
        <MenuItem disableRipple onClick={deleteDialog.onOpen}><Delete />ลบรายการ</MenuItem>
      </StyledMenu>
    </>
  )
}

export default CategoryDataTable