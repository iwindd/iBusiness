import { Stack, Typography } from "@mui/material"
import AddController from "./components/add-controller";
import CategoryDatatable from './components/datatable-categories';

const CategoryPage = async () => {
  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">ประเภทสินค้า</Typography>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}></Stack>
        </Stack>
        <>
          <AddController />
        </>
      </Stack>
      <CategoryDatatable />
    </Stack>
  )
}

export default CategoryPage