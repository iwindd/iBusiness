'use client'
import React from 'react'
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  SignInInputs as Inputs,
  SignInSchema as Schema
} from './schema';
import { AuthPage } from '..';
import { Button, Divider, Paper, TextField, Typography } from '@mui/material';
import { useInterface } from '@/app/providers/InterfaceProvider';
import { Login } from '@mui/icons-material';
import { useSnackbar } from 'notistack';

const fields = [
  { name: "email", label: "อีเมล", type: "email" },
  { name: "password", label: "รหัสผ่าน", type: "password" },
]
type SchemaKey = keyof Inputs;

function SignIn({ setPage }: {
  setPage: React.Dispatch<React.SetStateAction<AuthPage>>
}) {
  const router = useRouter()
  const { setBackdrop } = useInterface();
  const { enqueueSnackbar } = useSnackbar()

  const {
    register,
    handleSubmit,
    setError,
    resetField,
    formState: { errors }
  } = useForm<Inputs>({
    resolver: zodResolver(Schema)
  });

  const onSubmit: SubmitHandler<Inputs> = async (payload, e) => {
    e?.preventDefault();
    setBackdrop(true)
    const resp = await signIn("credentials", {
      email: payload.email,
      password: payload.password,
      redirect: false
    })

    setBackdrop(false)
    if (!resp?.error) {
      enqueueSnackbar("เข้าสู่ระบบสำเร็จแล้ว!", { variant: "success" })
      return router.refresh();
    } else {
      resetField("password");

      if (resp.status == 401) {
        setError("email", {
          type: "string",
          message: "ไม่พบผู้ใช้งาน"
        }, {
          shouldFocus: true
        })
      }
    }
  }

  return (
    <>
      <Paper
        className='w-96 mx-auto mt-24 px-4 py-4'
      >
        <form onSubmit={handleSubmit(onSubmit)} >
          <header className='mb-2'><Typography variant='h4'>เข้าสู่ระบบ</Typography></header>
          <Divider />
          <main className="mt-4 space-y-2">
            {
              fields.map((field) => {
                return (
                  <TextField
                    key={field.name}
                    autoFocus
                    fullWidth
                    type={field.type}
                    label={field.label}
                    error={(errors)[field.name as SchemaKey]?.message != undefined ? true : false}
                    helperText={(errors)[field.name as SchemaKey]?.message}
                    {...register(field.name as SchemaKey)}
                  />
                )
              })
            }
          </main>
          <footer className='flex mt-2'>
            <Button variant="contained" className='grow' color="success" type='submit' endIcon={< Login />} >เข้าสู่ระบบ</Button>
          </footer>
        </form>
      </Paper>
      <section className='text-center mt-2'>
        <Button
          variant='text'
          onClick={() => setPage("signup")}
        >
          ฉันไม่มีบัญชี ?
        </Button>
      </section>
    </>
  )
}

export default SignIn