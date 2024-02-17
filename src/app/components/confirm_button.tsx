import { Button, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import React from 'react'
import { setTimeout } from 'timers';
import { DialogProps, useInterface } from '../providers/InterfaceProvider';

const Confirmation = (props: DialogProps<{
  onOpen: () => void,
  onClose: () => void,
  State: boolean,
  title: string,
  onConfirm: () => void
}>) => {
  return (
    <>
      <DialogTitle id="responsive-dialog-title">
        {"แจ้งเตือน"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {props.data.title}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={props.onClose}>ยกเลิก</Button>
        <Button autoFocus onClick={props.data.onConfirm}>ยืนยัน</Button>
      </DialogActions>
    </>
  )
}

const ConfirmButton = (props: {
  className?: string,
  className2?: string,
  label: string,
  label2: string,
  disabled?: boolean,
  duration?: number,
  startIcon?: React.ReactNode,
  variant?: 'text' | 'outlined' | 'contained'
  onClick: () => void
}) => {
  const { setDialog } = useInterface();
  const Dialog = setDialog(Confirmation, {
    onConfirm: () => {
      Dialog.onClose()
      props.onClick()
    },
    title: props.label2
  }, "xs");
  const handle = () => Dialog.onOpen()

  return (
    <Button
      onClick={handle}
      disabled={props.disabled}
      variant={props.variant || "contained"}
      startIcon={props.startIcon}
    >
      {props.label}
    </Button>
  )
}

export default ConfirmButton