"use client";
import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, IconButton, InputLabel, MenuItem, Select, Stack, TextField } from '@mui/material';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useSnackbar, enqueueSnackbar } from 'notistack';
import { AddTwoTone, Rotate90DegreesCcw } from '@mui/icons-material';
import { Category, Product } from '@prisma/client';
import { ProductSchema, ProductSchemaInputs, ProductSearchSchema, ProductSearchSchemaInputs } from '@/schema/ProductSchema';
import { generateRandomEAN13 } from '@/libs/utils';
import { getProduct, upsertProduct } from '@/controllers/ProductController';
import Grid from '@mui/material/Unstable_Grid2/Grid2';
import { useInterface } from '@/app/providers/InterfaceProvider';
import { useDialog } from '@/hooks/use-dialog';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getAllCategories } from '@/controllers/CategoryController';

interface AddDialogProps {
  onClose: () => void;
  open: boolean,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface SearchDialogProps extends AddDialogProps {
  onSubmit: (product?: Product) => void;
}

export interface ProductFormDialogProps extends AddDialogProps {
  product: Product | null;
  categories: Category[];
}

function SearchDialog({ open, onClose, onSubmit, setLoading }: SearchDialogProps): React.JSX.Element {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<ProductSearchSchemaInputs>({ resolver: zodResolver(ProductSearchSchema) });
  const { enqueueSnackbar } = useSnackbar();

  const searchSubmit: SubmitHandler<ProductSearchSchemaInputs> = async (payload: ProductSearchSchemaInputs) => {
    setLoading(true);
    const resp = await getProduct(payload.serial);

    if (!resp.state) {
      enqueueSnackbar("เกิดข้อผิดพลาดกรุณาลองใหม่อีกครั้งภายหลัง", { variant: "error" });
    } else {
      onSubmit(resp?.data || { serial: payload.serial } as Product);
    }

    setLoading(false);
  };

  const random = () => {
    const randomSerial = generateRandomEAN13();
    setValue("serial", randomSerial)
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        component: 'form',
        onSubmit: handleSubmit(searchSubmit),
      }}
    >
      <DialogTitle>ค้นหาสินค้า</DialogTitle>
      <DialogContent>
        <Stack sx={{ mt: 2 }}>
          <Stack direction="row" spacing={2}>
            <TextField
              label="รหัสสินค้า"
              {...register("serial")}
              autoFocus
              placeholder='EAN8 or EAN13'
              error={errors['serial'] != undefined}
              helperText={errors['serial']?.message}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <IconButton disableRipple onClick={random}>
              <Rotate90DegreesCcw />
            </IconButton>
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

function ProductFormDialog({ open, setLoading, onClose, product, categories }: ProductFormDialogProps): React.JSX.Element {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<ProductSchemaInputs>({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      price: 0,
      stock: 0,
      cost: 0
    }
  });

  const { enqueueSnackbar } = useSnackbar();
  const [defaultCategory, setDefaultCategory] = React.useState<number>(0);
  const queryClient = useQueryClient();

  const submitProduct: SubmitHandler<ProductSchemaInputs> = async (payload: ProductSchemaInputs) => {
    setLoading(true);
    try {
      const resp = await upsertProduct(payload, product?.id);

      if (!resp.state) {
        enqueueSnackbar("เกิดข้อผิดพลาดกรุณาลองใหม่อีกครั้งภายหลัง", { variant: "error" });
      } else {
        await queryClient.refetchQueries({ queryKey: ['products'], type: 'active' })
        enqueueSnackbar("บันทึกสินค้าเรียบร้อยแล้ว!", { variant: "success" });
      }

      onClose();
    } catch (error) {
      enqueueSnackbar("เกิดข้อผิดพลาดกรุณาลองใหม่อีกครั้งภายหลัง", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setValue("serial", product?.serial || "");
    setValue("title", product?.title || "");
    setValue("price", product?.price || 0);
    setValue("stock", product?.stock || 0);
    setValue("cost", product?.cost || 0);
    setValue("keywords", product?.keywords || "");
    setValue('categoryId', product?.categoryId || 0);
    setDefaultCategory(product?.categoryId || 0);
  }, [product, setValue])

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        component: 'form',
        onSubmit: handleSubmit(submitProduct),
      }}
    >
      <DialogTitle>{product ? 'แก้ไขสินค้า' : 'เพิ่มสินค้า'}</DialogTitle>
      <DialogContent>
        <Stack sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid xs={6}>
              <TextField fullWidth label="รหัสสินค้า"  {...register("serial")} autoFocus disabled hidden />
            </Grid>
            <Grid xs={6}>
              <TextField fullWidth error={errors['title'] !== undefined} helperText={errors['title']?.message ?? ""} label="ชื่อสินค้า"  {...register("title")} />
            </Grid>
            <Grid xs={6}>
              <FormControl fullWidth>
                <InputLabel>{categories.length <= 0 ? "ไม่พบประเภทสินค้า" : "ประเภทสินค้า"}</InputLabel>
                {
                  categories.length > 0 ? (
                    <Select
                      label="ประเภทสินค้า"
                      defaultValue={defaultCategory}
                      fullWidth
                      {...register('categoryId', { valueAsNumber: true })}
                    >
                      {categories.map((category: Category) => <MenuItem value={category.id} key={category.id}>{category.title}</MenuItem>)}
                    </Select>
                  ) : (null)
                }
              </FormControl>
            </Grid>
            <Grid xs={6}>
              <TextField fullWidth error={errors['price'] !== undefined} helperText={errors['price']?.message} label="ราคาสินค้า"  {...register("price", { valueAsNumber: true })} />
            </Grid>
            <Grid xs={6}>
              <TextField fullWidth error={errors['cost'] !== undefined} helperText={errors['cost']?.message} label="ราคาต้นทุนสินค้า"  {...register("cost", { valueAsNumber: true })} />
            </Grid>
            <Grid xs={6}>
              <TextField fullWidth error={errors['stock'] !== undefined} helperText={errors['stock']?.message} label="สินค้าในสต๊อก"  {...register("stock", { valueAsNumber: true })} />
            </Grid>
            <Grid xs={12}>
              <TextField fullWidth error={errors['keywords'] !== undefined} helperText={errors['keywords']?.message} label="คีย์เวิร์ด"  {...register("keywords")} />
            </Grid>
          </Grid>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>ยกเลิก</Button>
        <Button type="submit">ตกลง</Button>
      </DialogActions>
    </Dialog>
  );
}

const AddController = () => {
  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]); // Initialize with your categories
  const { setBackdrop, isBackdrop } = useInterface();
  const { enqueueSnackbar } = useSnackbar();
  const [isSearch, setIsSearch] = useState<boolean>(true);
  const dialogInfo = useDialog();

  const onOpen = () => {
    if (categories.length <= 0) {
      return enqueueSnackbar("ไม่พบประเภทสินค้า", { variant: "error" })
    }

    setIsSearch(true);
    dialogInfo.handleOpen();
  }

  const onClose = () => {
    setProduct(null);
    dialogInfo.handleClose();
  }

  const onSubmit = (foundProduct?: Product) => {
    setProduct(foundProduct ? foundProduct : null);
    setIsSearch(false);
  };

  const { data } = useQuery({
    queryKey: ["categories_all"],
    queryFn: async () => {
      return await getAllCategories();
    }
  })

  useEffect(() => {
    if (data?.state) {
      setCategories(data.data as Category[])
    }
  }, [data, setCategories])

  return (
    <>
      <Button startIcon={<AddTwoTone />} variant="contained" onClick={onOpen}>เพิ่มรายการ</Button>

      <SearchDialog open={dialogInfo.open && !isBackdrop && isSearch} onClose={onClose} setLoading={setBackdrop} onSubmit={onSubmit} />
      <ProductFormDialog open={dialogInfo.open && !isBackdrop && !isSearch} onClose={onClose} setLoading={setBackdrop} product={product} categories={categories} />
    </>
  );
};

export default AddController;
