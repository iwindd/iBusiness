"use client";
import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField } from '@mui/material';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import { AddTwoTone } from '@mui/icons-material';
import { useInterface } from '@/app/providers/InterfaceProvider';
import { useDialog } from '@/hooks/use-dialog';
import { useQueryClient } from '@tanstack/react-query';
import { CategorySchema, CategorySchemaInputs } from '@/schema/CategorySchema';
import { upsertCategory } from '@/app/store/controllers/CategoryController';
import { Category } from '@prisma/client';

interface AddDialogProps {
  onClose: () => void;
  open: boolean;
  category: Category | null
}

export function CategoryFormDialog({ open, onClose, category }: AddDialogProps): React.JSX.Element {
  const { setBackdrop } = useInterface();
  const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm<CategorySchemaInputs>({ resolver: zodResolver(CategorySchema) });
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const onSubmit: SubmitHandler<CategorySchemaInputs> = async (payload: CategorySchemaInputs) => {
    try {
      setBackdrop(true)
      const resp = await upsertCategory(payload, category?.id);
      if (resp.state) {
        onClose();
        reset();
        await queryClient.refetchQueries({ queryKey: ['categories'], type: 'active' })
        enqueueSnackbar("บันทึกสินค้าเรียบร้อยแล้ว!", { variant: "success" });
      } else {
        enqueueSnackbar("เกิดข้อผิดพลาดกรุณาลองใหม่อีกครั้งภายหลัง", { variant: "error" });
      }
    } catch (error) {
      enqueueSnackbar("เกิดข้อผิดพลาดกรุณาลองใหม่อีกครั้งภายหลัง", { variant: "error" });
    } finally{
      setBackdrop(false);
    }
  };

  React.useEffect(() => {
    setValue("title", category?.title || "");
  }, [category, setValue])

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      PaperProps={{
        component: 'form',
        onSubmit: handleSubmit(onSubmit),
      }}
    >
      <DialogTitle>{category ? 'แก้ไขประเภทสินค้า' : 'เพิ่มประเภทสินค้า'}</DialogTitle>
      <DialogContent >
        <Stack sx={{ mt: 2 }}>
          <TextField
            label="ประเภทสินค้า"
            fullWidth
            {...register("title")}
            error={errors['title'] !== undefined}
            helperText={errors['title']?.message}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button type='button' onClick={onClose}>ปิด</Button>
        <Button type='submit'>ตกลง</Button>
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

      <CategoryFormDialog open={dialog.open && !isBackdrop} onClose={dialog.handleClose} category={null} />
    </>
  );
};

export default AddController;
