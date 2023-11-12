'use client'
import React from 'react'
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRegister } from './action';
import {
  SignUpInputs as Inputs,
  SignUpSchema as Schema
} from './schema';
import { AuthPage } from '..';
import { Button, Divider, Paper, TextField } from '@mui/material';
import { useInterface } from '@/app/providers/InterfaceProvider';

function SignUp({ setPage }: {
  setPage: React.Dispatch<React.SetStateAction<AuthPage>>
}) {
  const { useBackdrop } = useInterface();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setError
  } = useForm<Inputs>({
    resolver: zodResolver(Schema)
  })

  const onSubmit: SubmitHandler<Inputs> = async (payload) => {
    useBackdrop(true)
    const resp = await useRegister(payload);
    useBackdrop(false);
    if (!resp.success && resp?.data?.type == "email") {
      setError("email", {
        type: "string",
        message: resp.data.message
      }, {
        shouldFocus: true
      });
    }

    if (!resp.success) return;
    reset()
  }

  return (
    <Paper
      className='w-1/2 mx-auto mt-24 px-4 py-4'
    >
      <form onSubmit={handleSubmit(onSubmit)} className='w-full'>
        <header className='flex justify-center'>
          <h1 className='text-2xl bold'>Sign Up</h1>
          <Divider />
        </header>
        <div className="divider"></div>
        <main className='flex space-x-3 mt-6'>
          <div className='flex-grow'>
            <section className='space-y-1'>
              <TextField fullWidth label='Email...' {...register("email")} />
              <p className='text-error'>{errors.email?.message}</p>
              <TextField fullWidth label='Password...' {...register("password")} />
              <p className='text-error'>{errors.password?.message}</p>
              <TextField fullWidth label='Confirm Password...' {...register("password_confirmation")} />
              <p className='text-error'>{errors.password_confirmation?.message}</p>
            </section>
            <div className="divider"></div>
            <section className='space-y-1'>
              <TextField fullWidth label='Firstname...' {...register("firstname")} />
              <p className='text-error'>{errors.firstname?.message}</p>
              <TextField fullWidth label='Lastname...' {...register("lastname")} />
              <p className='text-error'>{errors.lastname?.message}</p>
              <TextField fullWidth label='Title...' {...register("title")} />
              <p className='text-error'>{errors.title?.message}</p>
              <TextField fullWidth label='Tel...' {...register("tel")} />
              <p className='text-error'>{errors.tel?.message}</p>
            </section>
          </div>
          <div className='flex-grow'>
            <section className='space-y-1'>
              <TextField fullWidth label='Province...' {...register("province")} />
              <p className='text-error'>{errors.province?.message}</p>
              <TextField fullWidth label='Area...' {...register("area")} />
              <p className='text-error'>{errors.area?.message}</p>
              <TextField fullWidth label='District...' {...register("district")} />
              <p className='text-error'>{errors.district?.message}</p>
              <TextField fullWidth label='Postal Code...' {...register("postalcode")} />
              <p className='text-error'>{errors.postalcode?.message}</p>
              <TextField fullWidth label='Address...' {...register("address")} />
              <p className='text-error'>{errors.address?.message}</p>
            </section>
          </div>
        </main>
        <footer className='mt-4'>
          <Button
            variant='outlined'
            className="btn btn-primary w-full"
            type='submit'
          >
            Sign up
          </Button>
          <section className='text-center mt-2'>
            <Button
              variant='text'
              color='inherit'
              onClick={() => setPage("signin")}
            >มีผู้ใช้อยู่แล้ว ?
            </Button>
          </section>
        </footer>
      </form>
    </Paper>
  )
}

export default SignUp