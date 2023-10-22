import { z } from 'zod';

export type SignInInputs = z.infer<typeof SignInSchema>
export const SignInSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

export type SignUpInputs = z.infer<typeof SignUpSchema>
export const SignUpSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  password_confirmation: z.string(),
  firstname: z.string(),
  lastname: z.string(),
  title: z.string(),
  tel: z.string(),
  province: z.string(),
  area: z.string(),
  district: z.string(),
  postalcode: z.string(),
  address: z.string()
}).refine((data) => data.password == data.password_confirmation, {
  message: "Passwords don't match",
  path: ["password_confirmation"],
})