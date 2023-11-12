'use client'
import React from 'react'
import Link from 'next/link';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  SignInInputs as Inputs,
  SignInSchema as Schema
} from './schema';
import { AuthPage } from '..';
import { Button, Paper, TextField } from '@mui/material';
import { useInterface } from '@/app/providers/InterfaceProvider';

function SignIn({ setPage }: {
  setPage: React.Dispatch<React.SetStateAction<AuthPage>>
}) {
  const router = useRouter()
  const { useBackdrop } = useInterface();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<Inputs>({
    resolver: zodResolver(Schema)
  });

  const onSubmit: SubmitHandler<Inputs> = async (payload) => {
    useBackdrop(true)
    const resp = await signIn("credentials", {
      email: payload.email,
      password: payload.password,
      redirect: true
    })

    if (!resp?.error) {
      return router.push("/");
    }
  }

  return (
    <Paper
      className='w-96 mx-auto mt-24 px-4 py-4'
    >
      <form onSubmit={handleSubmit(onSubmit)} >
        <header className='flex justify-center'>
          <h1 className='text-2xl bold'>Sign In</h1>
        </header>
        <div className="divider"></div>
        <main className='space-y-2 mt-6'>
          <TextField
            label="Email..."
            fullWidth
            {...register("email")}
          />
          <p className='text-error'>{errors.email?.message}</p>
          <TextField
            label="Password..."
            fullWidth
            {...register("password")}
          />
          <p className='text-error'>{errors.password?.message}</p>
        </main>
        <footer className='mt-4 flex justify-center flex-col'>
          <Button
            type='submit'
            variant="outlined"
          >
            Sign in
          </Button>
          <section className='text-center mt-2'>
            <Button
              variant='text'
              color='inherit'
              onClick={() => setPage("signup")}
            >
              ไม่มีชื่อผู้ใช้ ?
            </Button>
          </section>
        </footer>
      </form>
    </Paper>
  )
}

export default SignIn