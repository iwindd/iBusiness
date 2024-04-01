import { Box, Button, Container } from '@mui/material';
import { GridCsvExportMenuItem, GridPrintExportMenuItem, GridToolbarContainer, GridToolbarExportContainer, GridToolbarQuickFilter } from '@mui/x-data-grid';
import React from 'react'
import File from './components/menu/file';
import Commit from './components/menu/commit';
import Controller from './components/menu/controller';

const CustomToolbar = () => {
  return (
    <GridToolbarContainer className='flex justify-between px-2'>
      <Box className='flex gap-2'>
        <File />
        <Commit />
        <Controller />
      </Box>
      <GridToolbarQuickFilter />
    </GridToolbarContainer>
  )
}

export default CustomToolbar