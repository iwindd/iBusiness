"use client";
import { Box, Button, ButtonProps, IconButton, MenuItem, MenuItemProps } from '@mui/material'
import { DataGrid, DataGridProps, GridColDef, GridFilterModel, GridPaginationModel, GridSortDirection, GridSortModel, GridToolbarContainer, GridToolbarQuickFilter } from '@mui/x-data-grid'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import StyledMenu from './styledMenu'
import { MoreVert } from '@mui/icons-material'
import Link from 'next/link';
import _ from 'lodash';
import { v4 } from 'uuid';
import { useSearchParams } from 'next/navigation';

export interface SmartTableFetch {
  sort: GridSortModel,
  pagination: GridPaginationModel,
  filter: GridFilterModel
}

export interface TableOption {
  title: string,
  Icon: React.FC,
  props: ButtonProps,
  onClick: () => void
}

export interface ContextMenu {
  title: string,
  Icon: React.FC,
  props: MenuItemProps,
  href?: string,
  onClick?: (payload: any) => void
  close?: boolean
}

interface Props {
  columns: GridColDef[],
  options: TableOption[] | React.JSXElementConstructor<any>,
  burger?: boolean,
  context: ContextMenu[],

  loading?: boolean,
  name: string,

  fetch: (payload: SmartTableFetch, ...args: any) => any,
  bridge?: any[],

  selectRow?: number,
  setSelectRow?: React.Dispatch<React.SetStateAction<number>>,
  processRowUpdate?: (newData: any, oldData: any) => void
}

const CustomToolbar = (options: TableOption[]) => {
  return (
    <GridToolbarContainer className='flex justify-between px-2'>
      <Box className='flex gap-2'>
        {
          options.map((btn) => {
            const Icon = btn.Icon
            return <Button key={v4()} startIcon={<Icon />} onClick={btn.onClick} variant='text' {...btn.props}>{btn.title}</Button>
          })
        }
      </Box>
      <GridToolbarQuickFilter />
    </GridToolbarContainer>
  )
}

const SmartTable = (props: Props) => {
  const [selectRow, setSelectRow] = (props.selectRow !== undefined && props.setSelectRow !== undefined) ? [props.selectRow, props.setSelectRow] : React.useState<number>(0);
  const params = useSearchParams()
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

  const [rows, setRows] = React.useState<any[]>([]);
  const [total, setTotal] = React.useState<number>(0);

  const field = params.get('sort') as string;
  const sort = params.get('format') as GridSortDirection;

  const [sortModel, setSortModel] = React.useState<GridSortModel>((field && sort) ? [{field, sort}] : []);
  const [paginationModel, setPaginationModel] = React.useState<GridPaginationModel>({ pageSize: 15, page: 0, });
  const [filterModel, setFilterModel] = React.useState<GridFilterModel>({
    items: [],
    quickFilterExcludeHiddenColumns: true,
    quickFilterValues: [],
  });

  

  const { data, isLoading, refetch } = useQuery({
    queryKey: [props.name],
    queryFn: async () => {
      return await props.fetch({
        sort: sortModel,
        pagination: paginationModel,
        filter: filterModel
      }, ...(props.bridge || []))
    }
  })

  React.useEffect(() => {
    const fetchData = async () => {
      await refetch();
    };

    fetchData();
  }, [paginationModel, sortModel, filterModel])

  React.useEffect(() => {
    if (data?.success || data?.state) {
      setRows(data.data)
      setTotal(data.total)
    }
  })

  const contextMiddleware = (properties: ContextMenu) => {
    try {
      const payload = rows.find(r => r.id == selectRow);
      if (!payload) return;
      if (properties.close) handleClose()
      if (properties.onClick) return properties.onClick(payload)
    } catch (error) {

    }
  }

  const processRowUpdateMiddleware = (newData: any, oldData: any) => {
    if (!props.processRowUpdate) return oldData;
    if (_.isEqual(newData, oldData)) return oldData;

    return props.processRowUpdate(newData, oldData)
  }

  return (
    <>
      <DataGrid
        rows={rows}
        columns={[
          ...(props.columns),
          ...(
            props.burger ?
              [{
                field: 'tool',
                sortable: true,
                headerName: "",
                flex: 1,
                editable: false,
                renderCell: (e: any) => {
                  return (
                    <>
                      <IconButton
                        data-id={e.row.id}
                        onClick={controller}
                        className='mx-4'
                        disableRipple
                      >
                        <MoreVert />
                      </IconButton>
                    </>
                  )
                }
              }] : []
          )
        ]}
        loading={isLoading || props.loading}
        rowCount={total}

        disableColumnFilter
        disableColumnSelector
        disableDensitySelector
        density="compact"

        pageSizeOptions={[15, 30, 50, 100]}
        paginationModel={paginationModel}
        paginationMode="server"
        onPaginationModelChange={setPaginationModel}

        sortingMode="server"
        onSortModelChange={setSortModel}

        processRowUpdate={processRowUpdateMiddleware}

        filterMode="server"
        filterModel={filterModel}
        onFilterModelChange={(newModel) => setFilterModel(newModel)}
        slots={{ toolbar: Array.isArray(props.options) ? () => CustomToolbar(props.options as any) : props.options, }}
        slotProps={{
          row: {
            toolbar: { showQuickFilter: true },
            onContextMenu: controller,
            style: { cursor: 'context-menu' },
          },
        }}
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
        {
          props.context.map((props) => {
            const Icon = props.Icon;

            return (
              <MenuItem disableRipple {...props.props} onClick={() => contextMiddleware(props)} key={v4()}>
                {
                  props.href ? (
                    <Link href={props.href}>
                      <><Icon />{props.title}</>
                    </Link>
                  ) : (
                    <><Icon />{props.title}</>
                  )
                }
              </MenuItem>
            )
          })
        }

      </StyledMenu>
    </>
  )
}

export default SmartTable