"use client";
import { useInterface } from '@/app/providers/InterfaceProvider';
import { Edit, Save } from '@mui/icons-material'
import { Button, Divider, IconButton, Paper, TextField, Typography } from '@mui/material'
import { useSnackbar } from 'notistack';
import { lineConnect } from '../action';
import React, { useEffect } from 'react'
import { useSession } from 'next-auth/react';

const LineNotification = () => {
  const [token, setToken] = React.useState<string>("");
  const [editMode, setEditMode] = React.useState<boolean>(false);
  const { enqueueSnackbar } = useSnackbar();
  const { setBackdrop } = useInterface();
  const { data: session, update } = useSession();

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
        update({
          ...session,
          user: {
            ...session?.user,
            account: {
              ...session?.user.account,
              store: {
                ...session?.user.account.store,
                linetoken: token
              }
            }
          }
        })
      } else {
        setEditMode(true);
        setToken("");
        enqueueSnackbar("Invalid access token", { variant: "error" })
      }
    } else {
      setEditMode(true)
    }
  }

  const cancelEdit = async () => {
    setEditMode(false);
    if (session?.user.account.store.linetoken) setToken(session.user.account.store.linetoken)
  }

  useEffect(() => {
    if (session?.user.account.store.linetoken) setToken(session.user.account.store.linetoken)
  }, [session])

  return (
    <Paper sx={{ p: 2 }} className='space-y-2'>
      <Typography variant='body1'>Line Notification : </Typography>
      <Divider />
      <form className='flex w-full space-x-1' onSubmit={onSubmit}>
        <TextField
          value={token}
          onChange={(e) => setToken(e.target.value)}
          label="Line token : "
          disabled={!editMode}
          fullWidth
          type={editMode ? "text" : "password"}
        />
        <Button variant='outlined' type='submit'>
          {editMode ? ("บันทึก") : ("แก้ไข")}
        </Button>
        {
          editMode ? (
            <Button variant='outlined' onClick={cancelEdit}> ยกเลิก </Button>
          ) : (null)
        }
      </form>
    </Paper>
  )
}

export default LineNotification