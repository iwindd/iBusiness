import { DialogProps } from "@/app/providers/InterfaceProvider";
import { Button, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material";
import Selectize, { Option } from "./selectize";
import React, { useEffect } from "react";
import { SelectizeProductFilter } from "../action";
import MathTextField from './mathTextField';

const AddItemDialog = (props: DialogProps<{
  onAdd: (serial: string, changedBy: number) => void
}>) => {
  const [selectedOption, setSelectedOption] = React.useState<Option | null>(null);
  const [options, setOptions] = React.useState<Option[]>([]);
  const [filter, onFilter] = React.useState<string>("");
  const [changedBy, setChangedBy] = React.useState<string>("");

  const onConfirm = () => {
    props.data.onAdd(selectedOption?.value || "", Number(changedBy))
    props.onClose();
  }

  const handleSelectChange = (newValue: Option | null) => {
    setSelectedOption(newValue);
  };

  useEffect(() => {
    if (filter.length > 0) {
      const filtering = async (filter: string) => {
        const resp = await SelectizeProductFilter(filter);

        if (resp.success && resp.data && resp.data.length > 0) {
          setOptions((prevData) => {
            const newData = resp.data.map(p => {
              return {
                label: p.title,
                value: p.serial
              }
            })

            const uniqueNewData = newData.filter(newOption =>
              !prevData.some(prevOption => prevOption.value === newOption.value)
            );

            return [...prevData, ...uniqueNewData];
          })
        }
      }

      filtering(filter)
    }
  }, [filter])

  return (
    <>
      <DialogTitle id="responsive-dialog-title">
        {"เพิ่มสินค้า"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText className="space-y-2">
          <Selectize
            options={options}
            onChange={handleSelectChange}
            onFilter={onFilter}
            placeholder="ค้นหาสินค้า"
          />
          <MathTextField
            label="เปลี่ยนแปลงโดย"
            value={changedBy}
            onChange={(e) => setChangedBy(e.target.value)}
            fullWidth
          />
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