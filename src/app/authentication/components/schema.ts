import { z } from 'zod';

export type SignInInputs = z.infer<typeof SignInSchema>
export const SignInSchema = z.object({
  email: z.string().email().min(6),
  password: z.string().min(6),
})

export type SignUpInputs = z.infer<typeof SignUpSchema>
export const SignUpSchema = z.object({
  title: z.string().min(6).max(50),
  displaytitle: z.string().min(6).max(10),
  email: z.string().email().min(6),
  password: z.string().min(6),
  password_confirmation: z.string().min(6),
  firstname: z.string().min(6).max(50),
  lastname: z.string().min(6).max(50),
  tel: z.string().min(10).max(10),
  province: z.string().min(6).max(50),
  area: z.string().min(6).max(50),
  district: z.string().min(6).max(50),
  postalcode: z.string().min(3).max(10),
  address: z.string().min(1).max(50)
}).refine((data) => data.password == data.password_confirmation, {
  message: "Passwords don't match",
  path: ["password_confirmation"],
})