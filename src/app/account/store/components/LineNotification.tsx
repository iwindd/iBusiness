"use client";
import { useInterface } from '@/app/providers/InterfaceProvider';
import { Edit, Save } from '@mui/icons-material'
import { Box, IconButton, TextField } from '@mui/material'
import { useSnackbar } from 'notistack';
import React from 'react'
import { lineConnect } from '../action';
const LineNotification = () => {
  const [token, setToken] = React.useState<string>("");
  const [editMode, setEditMode] = React.useState<boolean>(false);
  const { enqueueSnackbar } = useSnackbar();
  const { setBackdrop } = useInterface();

  //pM0tvWBjru1kgECmNjdUxaXAP7VtUC1NCoeSclESuJl
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editMode) {
      //save
      setEditMode(false);
      setBackdrop(true);
      const resp = await lineConnect(token);
      setBackdrop(false);
      if (resp) {
        enqueueSnackbar("เชื่อมต่อสำเร็จ!", {variant: "success"})
      } else {
        setEditMode(true);
        setToken("");
        enqueueSnackbar("Invalid access token", { variant: "error" })
      }

    } else {
      //open edit
      setEditMode(true)
    }
  }

  return (
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
  )
}

export default LineNotification