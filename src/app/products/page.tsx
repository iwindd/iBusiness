import { Stack, Typography } from "@mui/material"
import ProductDatatable from "./components/datatable-products"
import AddController from "./components/add-controller"


const ProductsPage = () => {

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">สินค้า</Typography>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}></Stack>
        </Stack>
        <>
          <AddController />
        </>
      </Stack>
      <ProductDatatable />
    </Stack>
  )
}

export default ProductsPage