import { DialogProps } from "@/app/providers/InterfaceProvider";
import { Button, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Typography } from "@mui/material";
import React from "react";
import ProductField from "@/app/components/productfield";
import { Option } from "@/app/components/productfield/selectize";
import MathTextField from "@/app/products/stock/components/menu/components/mathTextField";

const AddBorrow = (props: DialogProps<{
  onAdd: (serial: string, changedBy: number) => void
}>) => {
  const [selectedOption, setSelectedOption] = React.useState<Option | null>(null);
  const [changedBy, setChangedBy] = React.useState<string>("");

  const onConfirm = () => {
    props.data.onAdd(selectedOption?.value || "", Number(changedBy))
    props.onClose();
  }

  const handleSelectChange = (newValue: Option) => {
    setSelectedOption(newValue);
  };

  return (
    <>
      <DialogTitle id="responsive-dialog-title">
        {"เพิ่มรายการเบิก"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText className="space-y-2">
          <TextField label="ชื่อการเบิก" fullWidth></TextField>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={props.onClose}>ยกเลิก</Button>
        <Button onClick={onConfirm}>ยืนยัน</Button>
      </DialogActions>
    </>
  )
}

export default AddBorrow