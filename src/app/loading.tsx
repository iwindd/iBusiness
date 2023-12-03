import { Box, CircularProgress } from '@mui/material'
import React from 'react'
import { classNames } from '../libs/utils';

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