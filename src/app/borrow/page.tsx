"use client";
import { Button, Paper } from '@mui/material'
import React from 'react'
import Header from '../components/header'
import { Add } from '@mui/icons-material'
import { useInterface } from '../providers/InterfaceProvider'
import { SelectizeGetProductData } from '../components/productfield/action';
import AddBorrow from './dialogs/addBorrow';

const BorrowPage = () => {
  const { setDialog, setBackdrop } = useInterface()

  const AddDialog = setDialog(AddBorrow, {
    onAdd: async (serial: string, changedBy: number) => {
      if (!serial || serial == "") return;
      setBackdrop(true);
      const resp = await SelectizeGetProductData(serial);
      setBackdrop(false);

      if (resp.success && resp.data && resp.data) {

      }
    }
  }, "xs");

  return (
    <div>
      <Paper className='p-2'>
        <Header title='การเบิกสินค้า' className='flex justify-end items-center gap-2'>
          <Button
            startIcon={<Add />} onClick={AddDialog.onOpen} variant="outlined">
            เพิ่มรายการ
          </Button>
        </Header>
      </Paper>
    </div>
  )
}

export default BorrowPage