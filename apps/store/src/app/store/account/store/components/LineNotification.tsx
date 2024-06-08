"use client";
import { useInterface } from '@/app/providers/InterfaceProvider';
import { Button, Card, CardActions, CardContent, CardHeader, Divider, TextField } from '@mui/material'
import { useSnackbar } from 'notistack';
import { lineConnect } from '../action';
import React, { useEffect } from 'react'
import { useSession } from 'next-auth/react';
import { CancelTwoTone, EditTwoTone, SaveTwoTone } from '@mui/icons-material';

const LineNotification = () => {
  const [token, setToken] = React.useState<string>("");
  const [editMode, setEditMode] = React.useState<boolean>(false);
  const { enqueueSnackbar } = useSnackbar();
  const { setBackdrop } = useInterface();
  const { data: session, update } = useSession();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
  }

  const onCancel = async () => {
    setEditMode(false);
    if (session?.user.account?.store.linetoken) setToken(session.user.account.store.linetoken)
  }

  const onEditMode = async () => {
    setEditMode(true)
  }

  useEffect(() => {
    if (session?.user.account?.store.linetoken) setToken(session.user.account.store.linetoken)
  }, [session])

  return (
    <Card
      component={'form'}
      onSubmit={onSubmit}
    >
      <CardHeader title="การแจ้งเตือนไลน์" />
      <Divider />
      <CardContent>
        <TextField
          value={token}
          onChange={(e) => setToken(e.target.value)}
          label="Line token : "
          disabled={!editMode}
          fullWidth
          type={editMode ? "text" : "password"}
        />

      </CardContent>
      <CardActions>
        {
          editMode ? (
            <>
              <Button onClick={onCancel} startIcon={<CancelTwoTone />} color="secondary"> ยกเลิก </Button>
              <Button type="submit" startIcon={<SaveTwoTone />} color="success"> บันทึก </Button>
            </>
          ) : (
            <Button onClick={onEditMode} startIcon={<EditTwoTone />} color="secondary">แก้ไข</Button>
          )
        }
      </CardActions>
    </Card>
  )
}

export default LineNotification