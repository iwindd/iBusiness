"use client";
import { DialogProps, useInterface } from '@/app/providers/InterfaceProvider'
import { Button, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import React from 'react'
import { addCategory } from '../action';

const AddDialog = (props: DialogProps<{
  refetch: () => void
}>) => {
  const [input, setInput] = React.useState<string>("");
  const { setBackdrop } = useInterface();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBackdrop(true);
    props.onClose();

    const resp = await addCategory({ title: input });
    setBackdrop(false);
    if (!resp.success) props.onOpen()
    props.data.refetch()
  }

  return (
    <form onSubmit={onSubmit}>
      <DialogTitle>
        เพิ่มประเภทสินค้า
      </DialogTitle>
      <DialogContent >
        <main className='pt-2'>
          <TextField
            value={input}
            onChange={e => setInput(e.target.value)}
            label="ประเภทสินค้า"
            fullWidth
          />
        </main>
      </DialogContent>
      <DialogActions>
        <Button type='button' onClick={props.onClose}>ปิด</Button>
        <Button type='submit'>เพิ่ม</Button>
      </DialogActions>
    </form>
  )
}

export default AddDialog