import { GridCsvExportMenuItem, GridPrintExportMenuItem, GridToolbarContainer, GridToolbarExportContainer, GridToolbarQuickFilter } from '@mui/x-data-grid';
import React from 'react'

const CustomToolbar = () => {
  return (
    <GridToolbarContainer className='flex justify-between'>
      <GridToolbarExportContainer>

        {/* CSV EXPORT */}
        <GridCsvExportMenuItem options={
          {
            utf8WithBom: true,
          }
        } />

        {/* PRINT EXPORT */}
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