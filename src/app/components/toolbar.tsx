import { GridCsvExportMenuItem, GridPrintExportMenuItem, GridToolbarContainer, GridToolbarExport, GridToolbarExportContainer, GridToolbarQuickFilter } from '@mui/x-data-grid';
import React from 'react'

const CustomToolbar = () => {
  return (
    <GridToolbarContainer className='flex justify-between'>
      <GridToolbarExportContainer>
        <GridCsvExportMenuItem options={
          {
            utf8WithBom: true,
          }
        } />
        <GridPrintExportMenuItem options={
          {
            hideFooter: true,
            hideToolbar: true
          }
        } />
      </GridToolbarExportContainer>
      <GridToolbarQuickFilter />
    </GridToolbarContainer>
  )
}

export default CustomToolbar