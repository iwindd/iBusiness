import React, { useEffect } from 'react'
import { DataGrid, GridSortModel, GridRowParams, GridFilterModel } from '@mui/x-data-grid';
import { useQuery } from '@tanstack/react-query';
import { Box, IconButton, MenuItem, Paper } from '@mui/material';
import { Order } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { getHistories } from '../action';
import CustomToolbar from '@/app/components/toolbar';
import { MoreVert, ViewAgenda } from '@mui/icons-material';
import StyledMenu from '@/app/components/styledMenu';
import Link from 'next/link';

const Datatable = () => {
  const router = useRouter();
  const [sortModel, setSortModel] = React.useState<GridSortModel>([]);
  const [paginationModel, setPaginationModel] = React.useState({
    pageSize: 15,
    page: 0,
  });

  const [selectRow, setSelectRow] = React.useState<number>(0);
  const [total, setTotal] = React.useState<number>(0);
  const [histories, setHistories] = React.useState<Order[]>([]);
  const [filterModel, setFilterModel] = React.useState<GridFilterModel>({
    items: [],
    quickFilterExcludeHiddenColumns: true,
    quickFilterValues: [],
  });


  const { data, isLoading, refetch, error } = useQuery({
    queryKey: ["histories"],
    queryFn: async () => {
      handleClose()
      return await getHistories(sortModel, paginationModel, filterModel);
    }
  })


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

  useEffect(() => {
    if (data?.success && data.data) {
      setHistories(data.data);
      if (data.total) setTotal(data.total);
    }
  }, [histories, data])

  useEffect(() => {
    const fetchData = async () => {
      await refetch()
    }

    fetchData()
  }, [paginationModel, sortModel, filterModel, refetch])

  const onSelectRow = (params: GridRowParams) => router.push(`/histories/${params.id}`)

  if (error) return <p>ERROR</p>

  return (
    <>
      <Paper sx={{ height: 750, width: '100%' }} >
        <DataGrid
          loading={isLoading}
          rows={histories}
          columns={[
            {
              field: 'createdAt',
              sortable: true,
              headerName: 'วันทำรายการ',
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
              field: 'price',
              sortable: true,
              headerName: 'ราคา',
              flex: 1,
              editable: false,
              valueFormatter: (data: any) => (data.value as number).toLocaleString()
            },
            {
              field: 'cost',
              sortable: true,
              headerName: 'ต้นทุน',
              flex: 1,
              editable: false,
              valueFormatter: (data: any) => (data.value as number).toLocaleString()
            },
            {
              field: 'profit',
              sortable: true,
              headerName: 'กำไร',
              flex: 1,
              editable: false,
              valueFormatter: (data: any) => (data.value as number).toLocaleString()
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
              valueFormatter: (data: any) => data.value.length <= 0 ? "-" : data.value
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

          onRowDoubleClick={onSelectRow}

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
          <MenuItem disableRipple ><ViewAgenda /><Link href={`/histories/${selectRow}`}>ดูรายละเอียด</Link></MenuItem>
        </StyledMenu>
      </Paper>
    </>
  )
}

export default Datatable