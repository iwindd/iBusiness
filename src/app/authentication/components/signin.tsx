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

function SignIn({setPage}: {
  setPage: React.Dispatch<React.SetStateAction<AuthPage>>
}) {
  const [isLoading, setLoading] = React.useState<boolean>(false);
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<Inputs>({
    resolver: zodResolver(Schema)
  });

  const onSubmit: SubmitHandler<Inputs> = async (payload) => {
    setLoading(true)
    const resp = await signIn("credentials", {
      email: payload.email,
      password: payload.password,
      redirect: true
    })

    if (!resp?.error) {
      return router.push("/store");
    }

    setLoading(false)
  }

  return (
    <div className="container mx-auto mt-20">
      <div className="mx-auto w-96">
        <form onSubmit={handleSubmit(onSubmit)} >
          <header className='flex justify-center'>
            <h1 className='text-2xl bold'>Sign In</h1>
          </header>
          <div className="divider"></div>
          <main className='space-y-2'>
            <input disabled={isLoading} className='input input-bordered w-full disabled:opacity-50' placeholder='Email...' {...register("email")} />
            <p className='text-error'>{errors.email?.message}</p>
            <input disabled={isLoading} className='input input-bordered w-full disabled:opacity-50' placeholder='Password...' {...register("password")} />
            <p className='text-error'>{errors.password?.message}</p>
          </main>
          <footer className='mt-4'>
            <button
              disabled={isLoading}
              className="btn btn-primary w-full"
            >
              {!isLoading ? (
                "Sign in"
              ) : (
                <span className="loading loading-dots loading-lg "></span>
              )}
            </button>
            <section className='text-center mt-2'>
              <button onClick={() => setPage("signup")} className='text-secondary hover:text-primary transition-all'>ไม่มีชื่อผู้ใช้ ?</button>
            </section>
          </footer>
        </form>
      </div>
    </div>
  )
}

export default SignIn