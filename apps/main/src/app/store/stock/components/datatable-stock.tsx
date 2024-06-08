"use client";
import React from 'react'
import * as ff from '@/libs/formatter'
import { StockItem } from '@/typings/stock';
import { useStock } from '../providers/StockProvider';
import { useQueryClient } from '@tanstack/react-query';
import { DataGrid, GridToolbar, gridClasses } from '@mui/x-data-grid';
import { Paper } from '@mui/material';
import thTHGrid from '@/components/locale/datatable';

const StockDatatable = () => {
  const { items, setItem } = useStock();
  const queryClient = useQueryClient();

  const columns = [
    { field: "serial", flex: 1, sortable: true, headerName: "#" },
    { field: "title", flex: 1, sortable: true, headerName: "ชื่อสินค้า" },
    { field: "stock", flex: 1, sortable: true, headerName: "คงเหลือ", valueFormatter: (data: any) => ff.number(data.value) },
    { field: "payload", flex: 1, sortable: true, headerName: "เปลี่ยนแปลง", valueFormatter: (data: any) => `${data.value > 0 ? "+" : "-"} ${ff.absNumber(data.value) as string}` },
    { field: "all", flex: 1, sortable: true, editable: true, headerName: "รวม", valueFormatter: (data: any) => ff.number(data.value) }
  ]

  const onUpdate = async (newData: StockItem, oldData: StockItem) => {
    if (newData.all != oldData.all) {
      newData.payload = newData.payload + (newData.all - oldData.all)
      setItem((prevData) => {
        const newData2 = [...prevData];

        const index = newData2.findIndex((data) => data.id === newData.id);
        newData2[index] = newData;

        return newData2;
      })
    }

    return newData
  }

  return (
    <Paper sx={{ height: 700 }}>
      <DataGrid
        localeText={thTHGrid}
        columns={columns}
        rows={items}
        processRowUpdate={onUpdate}

        slots={{
          toolbar: GridToolbar,
        }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
            csvOptions: {
              utf8WithBom: true
            },
            printOptions: {
              disableToolbarButton: true
            }
          },
        }}

        sx={{
          '& .MuiDataGrid-row:last-child': {
            '& .MuiDataGrid-cell': {
              borderBottomWidth: 0,
            },
          },
          '& .MuiDataGrid-colCell': {
            backgroundColor: 'var(--mui-palette-background-level1)',
            color: 'var(--mui-palette-text-secondary)',
            lineHeight: 1,
          },
          '& .MuiDataGrid-checkboxInput': {
            padding: '0 0 0 24px',
          },
          [`& .${gridClasses.columnHeader}`]: {
            backgroundColor: 'var(--mui-palette-background-level1)',
            color: 'var(--mui-palette-text-secondary)',
          },
          [`& .text-color-primary`]: { color: 'var(--mui-palette-primary-main)' },
          [`& .text-color-secondary`]: { color: 'var(--mui-palette-secondary-dark)' },
          [`& .text-color-info`]: { color: 'var(--mui-palette-info-main)' },
          [`& .text-color-warning`]: { color: 'var(--mui-palette-warning-main)' },
          [`& .text-color-success`]: { color: 'var(--mui-palette-success-main)' },
          [`& .text-color-error`]: { color: 'var(--mui-palette-error-main)' },
        }}
      />
    </Paper>
  )
}

export default StockDatatable