import React from 'react';
import { Upload } from '@mui/icons-material';
import { Button, DialogContentText, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useStock } from '../../providers/StockProvider';
import { DialogProps, useInterface } from '@/app/providers/InterfaceProvider';
import { useSnackbar } from 'notistack';

const Confirmation = (props: DialogProps<{
  onCommit: () => void
}>) => {

  const onConfirm = () => {
    props.onClose();
    props.data.onCommit();
  }

  return (
    <>
      <DialogTitle id="responsive-dialog-title">
        {"แจ้งเตือน"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          คุณต้องการจะจัดการสต๊อกหรือไม่ ?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={props.onClose}>ยกเลิก</Button>
        <Button onClick={onConfirm}>ยืนยัน</Button>
      </DialogActions>
    </>
  )
}

const Commit = () => {
  const { commit, setItem } = useStock();
  const {enqueueSnackbar} = useSnackbar();
  const { setBackdrop, setDialog } = useInterface();

  const confirmation = setDialog(Confirmation, {
    onCommit: async () => {
      setBackdrop(true);
      await commit()
      enqueueSnackbar("จัดการสต๊อกสินค้าสำเร็จแล้ว!", { variant: "success" });
      setBackdrop(false);
    }
  })

  return (
    <div>
      <Button
        onClick={confirmation.onOpen}
        variant='text'
        startIcon={<Upload />}
      >
        จัดการสต๊อก
      </Button>
    </div>
  );
}

export default Commit