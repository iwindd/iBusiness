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

const InputStyled: string = 'input input-bordered w-full disabled:opacity-50'

function SignUp({ setPage }: {
  setPage: React.Dispatch<React.SetStateAction<AuthPage>>
}) {
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
      <div className="mx-auto w-1/2 flex justify-center">
        <form onSubmit={handleSubmit(onSubmit)} className='w-full'>
          <header className='flex justify-center'>
            <h1 className='text-2xl bold'>Sign Up</h1>
          </header>
          <div className="divider"></div>
          <main className='flex space-x-3'>
            <div className='flex-grow'>
              <section className='space-y-1'>
                <input disabled={isLoading} className={InputStyled} placeholder='Email...' {...register("email")} />
                <p className='text-error'>{errors.email?.message}</p>
                <input disabled={isLoading} className={InputStyled} placeholder='Password...' {...register("password")} />
                <p className='text-error'>{errors.password?.message}</p>
                <input disabled={isLoading} className={InputStyled} placeholder='Confirm Password...' {...register("password_confirmation")} />
                <p className='text-error'>{errors.password_confirmation?.message}</p>
              </section>
              <div className="divider"></div>
              <section className='space-y-1'>
                <input disabled={isLoading} className={InputStyled} placeholder='Firstname...' {...register("firstname")} />
                <p className='text-error'>{errors.firstname?.message}</p>
                <input disabled={isLoading} className={InputStyled} placeholder='Lastname...' {...register("lastname")} />
                <p className='text-error'>{errors.lastname?.message}</p>
                <input disabled={isLoading} className={InputStyled} placeholder='Title...' {...register("title")} />
                <p className='text-error'>{errors.title?.message}</p>
                <input disabled={isLoading} className={InputStyled} placeholder='Tel...' {...register("tel")} />
                <p className='text-error'>{errors.tel?.message}</p>
              </section>
            </div>
            <div className='flex-grow'>
              <section className='space-y-1'>
                <input disabled={isLoading} className={InputStyled} placeholder='Province...' {...register("province")} />
                <p className='text-error'>{errors.province?.message}</p>
                <input disabled={isLoading} className={InputStyled} placeholder='Area...' {...register("area")} />
                <p className='text-error'>{errors.area?.message}</p>
                <input disabled={isLoading} className={InputStyled} placeholder='District...' {...register("district")} />
                <p className='text-error'>{errors.district?.message}</p>
                <input disabled={isLoading} className={InputStyled} placeholder='Postal Code...' {...register("postalcode")} />
                <p className='text-error'>{errors.postalcode?.message}</p>
                <input disabled={isLoading} className={InputStyled} placeholder='Address...' {...register("address")} />
                <p className='text-error'>{errors.address?.message}</p>
              </section>
            </div>
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
              <button onClick={() => setPage("signin")} className='text-secondary hover:text-primary transition-all'>มีผู้ใช้อยู่แล้ว ?</button>
            </section>
          </footer>
        </form>
      </div>
    </div >
  )
}

export default SignUp