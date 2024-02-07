"use client";
import { DialogProps, useInterface } from '@/app/providers/InterfaceProvider';
import { Button, Typography, Box, DialogTitle, DialogContent, DialogContentText, DialogActions, Toolbar, Paper } from '@mui/material';
import { useSnackbar } from 'notistack';
import React, { useEffect } from 'react'
import { HeaderRoot as Header } from '@/app/components/header';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { useRouter } from 'next/navigation';
import { useStock } from './providers/StockProvider';
import Menu from './components/menu';
import CustomToolbar from '@/app/components/toolbar';
import { Delete } from '@mui/icons-material';

export interface data {
  id: number,
  serial: string,
  title: string,
  stock: number,
  payload: number,
  all: number
}

const Stock = () => {
  const { items, setItem } = useStock();

  const onUpdate = (newData: data, oldData: data) => {
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
    <>

      <Paper className='p-2'>
        <Header>
          <Menu />
        </Header>
      </Paper>
      <Paper sx={{ height: 750, width: '100%' }} className='mt-2' >
        <DataGrid
          columns={
            [
              { field: "serial", flex: 1, sortable: true, headerName: "#" },
              { field: "title", flex: 1, sortable: true, headerName: "ชื่อสินค้า" },
              { field: "stock", flex: 1, sortable: true, headerName: "คงเหลือ", renderCell: ({ value }) => (value as number).toLocaleString() },
              {
                field: "payload", flex: 1, sortable: true, headerName: "เปลี่ยนแปลง", renderCell: ({ value }) => {
                  return (
                    <Typography variant="caption" color={value > 0 ? "green" : "red"} >
                      {value > 0 ? "+" : "-"} {Math.abs(value).toLocaleString()}
                    </Typography>
                  )
                }
              },
              { field: "all", flex: 1, sortable: true, editable: true, headerName: "รวม", renderCell: ({ value }) => (value as number).toLocaleString() },
              {
                field: 'actions',
                type: 'actions',
                flex: 1,
                headerName: 'เครื่องมือ',
                cellClassName: 'actions',
                getActions: ({ id }) => {
                  return [
                    <GridActionsCellItem
                      icon={<Delete />}
                      label="Delete"
                      key={"delete"}
                      onClick={() => {
                        setItem((prev) => {
                          return [...prev].filter(i => i.id != id);
                        })
                      }}
                      color="inherit"
                    />,
                  ];
                },
              },
            ]
          }
          density="compact"
          rows={items}
          processRowUpdate={onUpdate}
          slots={{
            toolbar: CustomToolbar,
          }}
        />
      </Paper>
    </>
  )
}

export default Stock