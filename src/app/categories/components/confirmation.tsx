import { DialogProps, useInterface } from '@/app/providers/InterfaceProvider';
import { Button, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import React from 'react'
import { deleteCategory } from '../action';

const Confirmation = (props: DialogProps<{
  id: number,
  title: string,
  onDelete: (id: number, title: string) => void,
  refetch: () => void
}>) => {

  const { setBackdrop } = useInterface();

  const onDelete = async () => {
    setBackdrop(true);
    props.onClose();
    const resp = await deleteCategory(props.data.id, props.data.title);

    setBackdrop(false);
    if (!resp.success) return  props.onOpen();
    props.data.refetch()
  }

  return (
    <>
      <DialogTitle id="responsive-dialog-title">
        {"แจ้งเตือน"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          คุณต้องการจะลบสินค้า {props.data.title} หรือไม่?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={props.onClose}>ยกเลิก</Button>
        <Button autoFocus onClick={onDelete}>ยืนยัน</Button>
      </DialogActions>
    </>
  )
}

export default Confirmation