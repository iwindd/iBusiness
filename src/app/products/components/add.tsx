"use client";
import { DialogProps, useInterface } from '@/app/providers/InterfaceProvider'
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, InputLabel, MenuItem, NativeSelect, Select, TextField } from '@mui/material';
import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form';
import { Inputs, Schema } from './schema';
import { addProduct } from '../action';
import { useQueryClient } from '@tanstack/react-query';

const AddDialog = (props: DialogProps<{
  categories: { id: string, title: string }[],
  refetch: () => void
}>) => {

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    control
  } = useForm<Inputs>({
    resolver: zodResolver(Schema),
    defaultValues: {
      price: 0,
      stock: 0,
      cost: 0
    }
  });

  const { useBackdrop } = useInterface();

  const onAddProduct: SubmitHandler<Inputs> = async (payload: Inputs) => {
    useBackdrop(true);
    props.onClose();
    const resp = await addProduct(payload);
    if (!resp.success){
      useBackdrop(false);
      props.onOpen();

      return
    }

    useBackdrop(false);
    props.data.refetch()
  }

  return (
    <>
      <form onSubmit={handleSubmit(onAddProduct)} className='w-full '>
        <DialogTitle id="responsive-dialog-title">
          เพิ่มสินค้า
        </DialogTitle>
        <DialogContent>
          <div className='mt-2'>
            <FormControl className='space-y-2 w-full'>
              <TextField fullWidth label="รหัสสินค้า"  {...register("serial")} autoFocus />
              <TextField fullWidth label="ชืนสินค้า"  {...register("title")} />
              <FormControl>
                <InputLabel>ประเภทสินค้า</InputLabel>
                <Select
                  {...register('categoryId', { valueAsNumber: true })}
                  label="ประเภทสินค้า"
                >
                  {
                    props.data.categories.map(category => <MenuItem value={category.id} key={category.id}>{category.title}</MenuItem>)
                  }
                </Select>
              </FormControl>
              <TextField fullWidth label="ราคาสินค้า"  {...register("price", { valueAsNumber: true })} />
              <TextField fullWidth label="ราคาต้นทุนสินค้า"  {...register("cost", { valueAsNumber: true })} />
              <TextField fullWidth label="สินค้าในสต๊อก"  {...register("stock", { valueAsNumber: true })} />
            </FormControl>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.onClose}>ยกเลิก</Button>
          <Button type="submit"> ยืนยัน </Button>
        </DialogActions>
      </form>
    </>
  )
}

export default AddDialog