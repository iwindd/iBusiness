import { DialogProps, useInterface } from '@/app/providers/InterfaceProvider';
import { Button, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import React from 'react'
import { deleteProduct } from '../action';
import { Product } from '@prisma/client';

const Confirmation = (props: DialogProps<{
  payload: Product,
  refetch: () => void
}>) => {
  const payload = props.payload
  const { setBackdrop } = useInterface();

  const onDelete = async () => {
    setBackdrop(true);
    props.onClose();
    const resp = await deleteProduct(payload.id, payload.title);

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
          คุณต้องการจะลบสินค้าหรือไม่?
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