import { Stack, Typography } from "@mui/material"
import StockDatatable from "./components/datatable-stock";
import AddController from "./components/controllers/add-controller";
import ImportController from "./components/controllers/import-controller";
import ExportController from './components/controllers/export-controller';
import CommitController from "./components/controllers/commit-controller";

const StockPage = async () => {
  return (
    <Stack spacing={3}>
      <Stack direction="row" alignItems={"center"} spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">จัดการสต๊อก</Typography>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <ImportController />
            <ExportController />
            <CommitController />
          </Stack>
        </Stack>
        <Stack>
          <AddController />
        </Stack>
      </Stack>
      <StockDatatable />
    </Stack>
  )
}

export default StockPage