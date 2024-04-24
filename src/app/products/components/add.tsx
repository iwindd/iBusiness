"use client";
import { DialogProps, useInterface } from '@/app/providers/InterfaceProvider'
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, CircularProgress, DialogActions, DialogContent, DialogTitle, FormControl, IconButton, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form';
import { InputSearch, Inputs, Schema, SchemaSearch } from './schema';
import { Rotate90DegreesCcw } from '@mui/icons-material';
import { generateRandomEAN13 } from '@/libs/utils';
import { findProduct, upsertProduct } from '../action';
import { useSnackbar } from 'notistack';
import { Category, Product } from '@prisma/client';

const AddDialog = (props: DialogProps<{
  categories: Category[],
  refetch: () => void
}>) => {
  const [page, setPage] = React.useState(0);
  const [categories, setCategories] = React.useState<Category[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm<InputSearch>({
    resolver: zodResolver(SchemaSearch),
  });

  const {
    register: reg2,
    handleSubmit: hs2,
    formState: { errors: errs2 },
    setValue: sv2
  } = useForm<Inputs>({
    resolver: zodResolver(Schema),
    defaultValues: {
      price: 0,
      stock: 0,
      cost: 0
    }
  })

  const { setBackdrop } = useInterface();
  const { enqueueSnackbar } = useSnackbar();
  const [product, setProduct] = React.useState<Product | null>(null);
  const [defaultCategory, setDefaultCategory] = React.useState<number>(0);

  const onClose = () => {
    if (page == 1) {
      props.onOpen(0)
    }

    props.onClose()
  }

  const SearchSubmit: SubmitHandler<InputSearch> = async (payload: InputSearch) => {
    setPage(-1);

    if (product != null) {
      sv2("serial", product.serial);
      sv2("title", product.title);
      sv2("price", product.price);
      sv2("stock", product.stock);
      sv2("cost", product.cost);
      sv2("keywords", product.keywords);
      sv2('categoryId', product.categoryId);
      setDefaultCategory(product.categoryId);
      setPage(2)

      return
    }

    const resp = await findProduct(payload.serial);
    setBackdrop(false);

    if (!resp.state) {
      setPage(0);
      enqueueSnackbar("เกิดข้อผิดพลาดกรุณาลองใหม่อีกครั้งภายหลัง", { variant: "error" });
      return
    }

    if (resp.data != null) {
      setPage(1);
      setProduct(resp.data);
      return
    }

    sv2("serial", payload.serial);
    sv2("title", "");
    sv2("price", 0);
    sv2("stock", 0);
    sv2("cost", 0);
    sv2("keywords", "");

    setPage(2);
    return
  }

  const SubmitProduct: SubmitHandler<Inputs> = async (payload: Inputs) => {
    setPage(-1);
    const resp = await upsertProduct(payload, product?.id);

    console.log(resp);
    

    if (!resp.state){
      setPage(2)
      enqueueSnackbar("เกิดข้อผิดพลาดกรุณาลองใหม่อีกครั้งภายหลัง", { variant: "error" });
      return
    }

    enqueueSnackbar("บันทึกสินค้าเรียบร้อยแล้ว!", { variant: "success" });
    /* props.onClose(); */
  }

  const random = () => setValue('serial', generateRandomEAN13())

  React.useEffect(() => {
    if (props.data.categories && props.data.categories.length > 0) {
      setCategories(props.data.categories)
    }
  }, [props])

  return (
    <>
      <form onSubmit={
        page == 2 ? (hs2(SubmitProduct)) : (handleSubmit(SearchSubmit))
      } className='w-full '>
        <DialogTitle id="responsive-dialog-title">
          เพิ่มสินค้า
        </DialogTitle>
        <DialogContent>
          <div className='mt-2'>
            {
              page == -1 ? (
                <Box className="flex justify-center">
                  <CircularProgress />
                </Box>
              ) : page == 0 ? (
                <FormControl className='w-full '>
                  <div className="grid grid-cols-12">
                    <TextField
                      fullWidth
                      label="รหัสสินค้า"
                      {...register("serial")}
                      autoFocus
                      className='col-span-11 '
                      placeholder='EAN8 or EAN13'
                      error={errors['serial'] != undefined}
                      helperText={errors['serial']?.message}
                      InputLabelProps={{ shrink: true }}
                    />
                    <IconButton disableRipple onClick={random}  >
                      <Rotate90DegreesCcw className='text-sm hover:text-base active:text-lg' />
                    </IconButton>
                  </div>
                </FormControl>
              ) : page == 1 ? (
                <>
                  <Typography>
                    พบสินค้านี้มีในระบบแล้ว คุณต้องการที่จะแก้ไขหรือไม่?
                  </Typography>
                </>
              ) : page == 2 ? (
                <FormControl className='w-full grid grid-cols-2 gap-2'>
                  <TextField label="รหัสสินค้า"  {...reg2("serial")} autoFocus disabled hidden />
                  <TextField error={errs2['title'] !== undefined} helperText={errs2['title']?.message} label="ชื่อสินค้า"  {...reg2("title")} />
                  <FormControl>
                    <InputLabel>{categories.length <= 0 ? "ไม่พบประเภทสินค้า" : "ประเภทสินค้า"}</InputLabel>
                    {
                      categories.length > 0 ? (
                        <Select
                          label="ประเภทสินค้า"
                          defaultValue={defaultCategory}
                          {...reg2('categoryId', { valueAsNumber: true })}
                        >
                          {categories.map((category: Category) => <MenuItem value={category.id} key={category.id}>{category.title}</MenuItem>)}
                        </Select>
                      ) : (null)
                    }
                  </FormControl>
                  <TextField error={errs2['price'] !== undefined} helperText={errs2['price']?.message} label="ราคาสินค้า"  {...reg2("price", { valueAsNumber: true })} />
                  <TextField error={errs2['cost'] !== undefined} helperText={errs2['cost']?.message} label="ราคาต้นทุนสินค้า"  {...reg2("cost", { valueAsNumber: true })} />
                  <TextField error={errs2['stock'] !== undefined} helperText={errs2['stock']?.message} label="สินค้าในสต๊อก"  {...reg2("stock", { valueAsNumber: true })} />
                  <TextField error={errs2['keywords'] !== undefined} helperText={errs2['keywords']?.message} label="คีย์เวิร์ด"  {...reg2("keywords")} />
                </FormControl>
              ) : null
            }
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>ยกเลิก</Button>
          <Button type="submit"> ตกลง </Button>
        </DialogActions>
      </form>
    </>
  )
}

export default AddDialog