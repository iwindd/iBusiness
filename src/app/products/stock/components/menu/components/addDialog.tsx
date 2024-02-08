import { DialogProps } from "@/app/providers/InterfaceProvider";
import { Button, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from "@mui/material";
import React from "react";
import MathTextField from './mathTextField';
import ProductField from "@/app/components/productfield";
import { Option } from "@/app/components/productfield/selectize";

const AddItemDialog = (props: DialogProps<{
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
        {"เพิ่มสินค้า"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText className="space-y-2">
          <ProductField onSelected={handleSelectChange} />
          <MathTextField
            label="เปลี่ยนแปลงโดย"
            value={changedBy}
            onChange={(e) => setChangedBy(e.target.value)}
            fullWidth
          />
          <Typography
            variant="caption"
            className="p-2"
          >
            <i>i</i> : สามารถใช้สูตรทางคณิตศาสตร์ได้ เช่น 6 * 12
          </Typography>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={props.onClose}>ยกเลิก</Button>
        <Button onClick={onConfirm}>ยืนยัน</Button>
      </DialogActions>
    </>
  )
}

export default AddItemDialog