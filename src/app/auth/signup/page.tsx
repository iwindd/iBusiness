'use client'
import React from 'react'
import Link from 'next/link';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Schema, Inputs } from './schema';
import { useRegister } from './action';

function SignUp() {
  const [isLoading, setLoading] = React.useState<boolean>(false);

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
    setLoading(true)
    const resp = await useRegister(payload);
    setLoading(false);
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
    <div className="container mx-auto mt-20">
      <div className="mx-auto w-96 flex justify-center">
        <form onSubmit={handleSubmit(onSubmit)} className='w-full'>
          <header className='flex justify-center'>
            <h1 className='text-2xl bold'>Sign Up</h1>
          </header>
          <div className="divider"></div>
          <main className='space-y-2'>
            <input disabled={isLoading} className='input input-bordered w-full disabled:opacity-50' placeholder='Email...' {...register("email")} />
            <p className='text-error'>{errors.email?.message}</p>
            <input disabled={isLoading} className='input input-bordered w-full disabled:opacity-50' placeholder='Password...' {...register("password")} />
            <p className='text-error'>{errors.password?.message}</p>
            <input disabled={isLoading} className='input input-bordered w-full disabled:opacity-50' placeholder='Confirm Password...' {...register("password_confirmation")} />
            <p className='text-error'>{errors.password_confirmation?.message}</p>
          </main>
          <footer className='mt-4'>
            <button
              className="btn btn-primary w-full"
              disabled={isLoading}
            >
              {!isLoading ? (
                "Sign up"
              ) : (
                <span className="loading loading-dots loading-lg "></span>
              )}
            </button>
            <section className='text-center mt-2'>
              <Link href={"/auth/signin"} className='text-secondary hover:text-primary transition-all'>มีผู้ใช้อยู่แล้ว ?</Link>
            </section>
          </footer>
        </form>
      </div>
    </div >
  )
}

export default SignUp