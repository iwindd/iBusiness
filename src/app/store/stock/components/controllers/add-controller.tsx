"use client";
import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography } from '@mui/material';
import { AddTwoTone } from '@mui/icons-material';
import { useInterface } from '@/app/providers/InterfaceProvider';
import { useDialog } from '@/hooks/use-dialog';
import MathTextField from '../MatchTextField';
import { getProduct } from '@/controllers/ProductController';
import { useStock } from '../../providers/StockProvider';
import { useSnackbar } from 'notistack';
import { Option } from '@/app/store/components/productfield/selectize';
import ProductField from '@/app/store/components/productfield';

interface StockDialogProps {
  onClose: () => void;
  open: boolean,
}

function StockFormDialog({ open, onClose }: StockDialogProps): React.JSX.Element {
  const [selectedOption, setSelectedOption] = React.useState<Option | null>(null);
  const [changedBy, setChangedBy] = React.useState<string>("");
  const { setBackdrop } = useInterface();
  const { enqueueSnackbar } = useSnackbar();
  const { items, setItem } = useStock();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const serial = selectedOption?.value;
    const value = Number(changedBy)
    if (!serial || serial == "") return;
    setBackdrop(true);

    try {
      const resp = await getProduct(serial);
      setBackdrop(false);

      if (resp.state && resp.data) {
        const data = resp.data;

        if (items.find(item => item.id == data.id)) {
          return enqueueSnackbar("มีสินค้านี้ในรายการอยู่แล้ว!", { variant: "error" })
        }

        setItem(prevItems => {
          return [...prevItems, {
            id: data.id,
            serial: data.serial,
            title: data.title,
            stock: data.stock,
            payload: value || 0,
            all: (data.stock) + value || 0
          }]
        })

        onClose();
      } else {
        enqueueSnackbar("ไม่พบสินค้า", { variant: 'error' })
      }
    } catch (error) {
      enqueueSnackbar("ไม่สามารถทำรายการได้ กรุณาลองอีกครั้งภายหลัง!", { variant: 'error' })
    }
  }

  const handleSelectChange = (newValue: Option) => {
    setSelectedOption(newValue);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      PaperProps={{
        component: 'form',
        onSubmit: onSubmit,
      }}
    >
      <DialogTitle>ค้นหาสินค้า</DialogTitle>
      <DialogContent>
        <Stack sx={{ mt: 2 }}>
          <Stack flexDirection={"column"} spacing={2}>
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
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>ยกเลิก</Button>
        <Button type="submit"> ค้นหา </Button>
      </DialogActions>
    </Dialog>
  );
}

const AddController = () => {
  const dialog = useDialog();
  const { isBackdrop } = useInterface();

  return (
    <>
      <Button startIcon={<AddTwoTone />} variant="contained" onClick={dialog.handleOpen}>เพิ่มรายการ</Button>

      <StockFormDialog open={dialog.open && !isBackdrop} onClose={dialog.handleClose} />
    </>
  );
};

export default AddController;
