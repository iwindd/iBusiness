import { Box, Button, Paper, TextField, Typography, IconButton, Divider } from '@mui/material';
import React from 'react'
import { classNames } from '../../../libs/utils';
import { Save } from '@mui/icons-material';
import LineNotification from './components/LineNotification';
import Time from './components/Time';
import Grid from '@mui/material/Unstable_Grid2/Grid2';

const StorePage = () => {
  return (
    <Grid container spacing={1}>
      <Grid xs={12} lg={6}><Time /></Grid>
      <Grid xs={12} lg={6}><LineNotification /></Grid>
    </Grid>
  )
}

export default StorePage