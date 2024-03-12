"use client";
import { useInterface } from '@/app/providers/InterfaceProvider';
import { Edit, Save } from '@mui/icons-material'
import { Divider, IconButton, Paper, TextField, Typography } from '@mui/material'
import { useSnackbar } from 'notistack';
import { lineConnect } from '../action';
import React from 'react'

const LineNotification = () => {
  const [token, setToken] = React.useState<string>("");
  const [editMode, setEditMode] = React.useState<boolean>(false);
  const { enqueueSnackbar } = useSnackbar();
  const { setBackdrop } = useInterface();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editMode) {
      //save
      setEditMode(false);
      setBackdrop(true);
      const resp = await lineConnect(token);
      setBackdrop(false);
      if (resp) {
        enqueueSnackbar("เชื่อมต่อสำเร็จ!", { variant: "success" })
      } else {
        setEditMode(true);
        setToken("");
        enqueueSnackbar("Invalid access token", { variant: "error" })
      }
    } else {
      setEditMode(true)
    }
  }

  return (
    <Paper sx={{ p: 2 }} className='space-y-2'>
      <Typography variant='body1'>Line Notification : </Typography>
      <Divider />
      <form className='flex w-full' onSubmit={onSubmit}>
        <TextField
          value={token}
          onChange={(e) => setToken(e.target.value)}
          label="Line token : "
          disabled={!editMode}
        />
        <div>
          <IconButton color="primary" type='submit'>
            {editMode ? (<Save />) : (<Edit />)}
          </IconButton>
        </div>
      </form>
    </Paper>
  )
}

export default LineNotification