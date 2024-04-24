import { Box, Button, Container, Stack } from '@mui/material';
import { GridCsvExportMenuItem, GridPrintExportMenuItem, GridToolbarContainer, GridToolbarExportContainer, GridToolbarQuickFilter } from '@mui/x-data-grid';
import React from 'react'
import { useInterface } from '../providers/InterfaceProvider';
import AddDialog from './components/add';
import { Add } from '@mui/icons-material';
import { useQueryClient } from '@tanstack/react-query';


const CustomToolbar = () => {
  const { setDialog } = useInterface();
  const queryClient = useQueryClient();

  const addDialog = setDialog(AddDialog, {
    refetch: async () => {
      await queryClient.refetchQueries({ queryKey: ['categories'], type: 'active' })
    }
  }, "sm")

  return (
    <GridToolbarContainer sx={{justifyContent: "space-between"}}>
      <Stack>
        <Button
          startIcon={<Add />}
          onClick={addDialog.onOpen}
          variant='text'
        >
          เพิ่มรายการ
        </Button>
      </Stack>
      <GridToolbarQuickFilter />
    </GridToolbarContainer>
  )
}

export default CustomToolbar