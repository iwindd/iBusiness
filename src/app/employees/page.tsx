import { Stack, Typography } from "@mui/material"

const EmployeePage = async () => {
  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">พนักงาน</Typography>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}></Stack>
        </Stack>
      </Stack>
    </Stack>
  )
}

export default EmployeePage