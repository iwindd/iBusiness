import { Box, Button, Container, Stack } from '@mui/material';
import { GridCsvExportMenuItem, GridPrintExportMenuItem, GridToolbarContainer, GridToolbarExportContainer, GridToolbarQuickFilter } from '@mui/x-data-grid';
import React from 'react'
import File from './components/menu/file';
import Commit from './components/menu/commit';
import Controller from './components/menu/controller';

const CustomToolbar = () => {
  return (
    <GridToolbarContainer sx={{justifyContent: "space-between"}}>
      <Stack direction="row">
        <File />
        <Commit />
        <Controller />
      </Stack>
      <GridToolbarQuickFilter />
    </GridToolbarContainer>
  )
}

export default CustomToolbar