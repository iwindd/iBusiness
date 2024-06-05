import { Stack, Typography } from "@mui/material"
import ProductDatatable from "./components/datatable-products"
import AddController from "./components/add-controller"
import { getAllCategories } from "@/app/store/controllers/CategoryController"
import { Category } from "@prisma/client"

const ProductsPage = async () => {
  const categories = (await getAllCategories()).data as Category[];

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">สินค้า</Typography>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}></Stack>
        </Stack>
        <>
          <AddController categories={categories} />
        </>
      </Stack>
      <ProductDatatable categories={categories} />
    </Stack>
  )
}

export default ProductsPage