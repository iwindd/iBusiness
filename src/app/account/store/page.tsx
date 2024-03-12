import { Box, Button, Grid, Paper, TextField, Typography, IconButton, Divider } from '@mui/material';
import React from 'react'
import { classNames } from '../../../libs/utils';
import { Save } from '@mui/icons-material';
import LineNotification from './components/LineNotification';
import Time from './components/Time';

const StorePage = () => {
  return (
    
    <Grid container gap={1}>
      <Grid xs={12} md={5}><LineNotification /></Grid>
      <Grid xs={12} md={5}><Time /></Grid>
    </Grid>
  )
}

export default StorePage