'use client'
import React from 'react'
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Register from './action';
import {
  SignUpInputs as Inputs,
  SignUpSchema as Schema
} from './schema';
import { AuthPage } from '..';
import { Button, Divider, Paper, TextField, Typography } from '@mui/material';
import { useInterface } from '@/app/providers/InterfaceProvider';
import { Lock, NavigateBefore, NavigateNext } from '@mui/icons-material';
import { useSnackbar } from 'notistack';

const fields = [
  {
    name: "shop",
    label: "ธุรกิจของคุณ",
    fields: [
      { name: "title", label: "ชื่อธุรกิจ (เต็ม)", type: "text" },
      { name: "displaytitle", label: "ชื่อธุรกิจ (ย่อ)", type: "text" }
    ]
  },
  {
    name: "account_infomation",
    label: "รายละเอียดบัญชี",
    fields: [
      { name: "firstname", label: "ชื่อจริง", type: "text" },
      { name: "lastname", label: "นามสกุล", type: "text" },
      { name: "tel", label: "เบอร์โทรศัพท์", type: "text" },
    ]
  },
  {
    name: "account",
    label: "บัญชี",
    fields: [
      { name: "email", label: "อีเมล", type: "email" },
      { name: "password", label: "รหัสผ่าน", type: "password" },
      { name: "password_confirmation", label: "ยืนยันรหัสผ่าน", type: "password" },
    ]
  },
  {
    name: "address",
    label: "ที่อยู่ธุรกิจ",
    fields: [
      { name: "province", label: "จังหวัด", type: "text" },
      { name: "area", label: "เขต/อำเภอ", type: "text" },
      { name: "district", label: "แขวง/ตำบล", type: "text" },
      { name: "postalcode", label: "รหัสไปรษณีย์", type: "text" },
      { name: "address", label: "ที่อยู่", type: "text" },
    ]
  }
]
type SchemaKey = keyof Inputs

function SignUp({ setPage }: {
  setPage: React.Dispatch<React.SetStateAction<AuthPage>>
}) {
  const { setBackdrop } = useInterface();
  const [step, setStep] = React.useState<number>(0);
  const { enqueueSnackbar } = useSnackbar()

  const {
    register,
    handleSubmit,
    reset,
    trigger,
    formState: { errors },
    setError
  } = useForm<Inputs>({
    resolver: zodResolver(Schema)
  })

  const validatingStep = (key: SchemaKey) => {
    const shouldStep = fields.findIndex((category) => {
      return category.fields.find(field => {
        return field.name == key
      })
    })

    if (shouldStep != step) setStep(shouldStep)
  }

  const onSubmit: SubmitHandler<Inputs> = async (payload) => {
    setBackdrop(true)
    const resp = await Register(payload);
    if (!resp.success && resp?.data?.type == "email") {
      validatingStep("email")
      setError("email", {
        type: "string",
        message: resp.data.message
      }, {
        shouldFocus: true
      });
    }

    setBackdrop(false);
    if (!resp.success) return;

    reset()
    setPage("signin");
    enqueueSnackbar("ลงทะเบียนเข้าใช้งานระบบเรียบร้อยแล้ว :)", { variant: "success" });
  }

  const onPrevious = () => {
    if (step - 1 <= -1) return;

    setStep(step - 1);
  }

  const onNext = async () => {
    if (step + 1 >= fields.length) return;
    const resp: boolean = await trigger([...fields[step]?.fields.map(f => f.name)] as SchemaKey[])
    if (!resp) return;

    setStep(step + 1);
  }

  if (errors[Object.keys(errors)[0] as SchemaKey]) {
    const key: SchemaKey = Object.keys(errors)[0] as SchemaKey;
    if (key != undefined && errors[key]) validatingStep(key);
  }

  return (
    <>
      <Paper
        className='w-96 mx-auto mt-24 px-4 py-4'
      >
        <form action="" className='w-full' onSubmit={handleSubmit(onSubmit)}>
          <header className='mb-2'><Typography variant='h4'>ลงทะเบียน</Typography></header>
          <Divider />
          <main className='mt-4'>
            {
              fields.map((category, index) => {
                return (
                  <section
                    key={category.name}
                    className='space-y-2'
                    hidden={index != step}
                  >
                    {
                      category.fields.map((field) => {
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
                  </section>
                )
              })
            }
          </main>
          <footer className='flex justify-between mt-2 gap-2'>
            <Button variant="contained" color="inherit" disabled={step == 0} onClick={onPrevious} startIcon={<NavigateBefore />}>กลับ</Button>
            <Button variant="contained" className='grow' color="success" disabled={step != fields.length - 1} type='submit' endIcon={< Lock />} >ลงทะเบียน</Button>
            <Button variant="contained" color="primary" disabled={step == fields.length - 1} onClick={onNext} endIcon={< NavigateNext />}>ถัดไป</Button>
          </footer>
        </form>
      </Paper >
      <section className='text-center mt-2'>
        <Button
          variant='text'
          onClick={() => setPage("signin")}
        >
          ฉันมีบัญชีอยู่แล้ว ?
        </Button>
      </section>
    </>
  )
}

export default SignUp