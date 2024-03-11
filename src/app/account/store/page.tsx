import { Box, Button, Grid, Paper, TextField, Typography, IconButton } from '@mui/material';
import React from 'react'
import { classNames } from '../../../libs/utils';
import { Save } from '@mui/icons-material';
import LineNotification from './components/LineNotification';

const StorePage = () => {
  return (
    <Paper sx={{ p: 2 }}>
      <LineNotification/>
    </Paper>
  )
}

export default StorePage