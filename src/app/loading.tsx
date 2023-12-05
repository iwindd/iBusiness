import { Box, CircularProgress } from '@mui/material'
import React from 'react'

const Loading = () => {
  return (
    <>
      <Box className="flex justify-center">
        <CircularProgress />
      </Box>
    </>
  )
}

export default Loading